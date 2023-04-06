const functions = require('firebase-functions');
const {Configuration, OpenAIApi} = require('openai');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const textToSpeech = require('@google-cloud/text-to-speech');

function createPrompt(teacher, student, subject, text) {
    return `Response as my Teacher (${teacher.name},${teacher.character}). I am your Student(${student.name}. I am ${student.age}) year old.
    During our conversation you should ask me about ${subject.name} and ${subject.questions} and let us debate about ${subject.related}.
    Remember to ask ONLY ONE question at the time and be curious obout my opinion and point of view.YOU start the conversation as a teacher. Below is a record of our recent quotes:
    ${text}`;
}

exports.createPrompt = createPrompt;

async function getGPT3Response(prompt, teacher, student) {
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createCompletion({
        model: student.model,
        prompt: prompt,
        temperature: 0.8,
        max_tokens: 1500,
        stop: [`${teacher.name}:`, `${student.name}:`, "Student:"],
    });
    return completion.data.choices[0].text;
}

exports.getGPT3Response = getGPT3Response;

async function getTTSGoogleResponse(gpt3Response, teacher) {
    const client = new textToSpeech.TextToSpeechClient();
    const request = {
        input: {text: gpt3Response},
        voice: teacher["TTS"].voice,
        audioConfig: teacher["TTS"].audioConfig,
    };

    const [response] = await client.synthesizeSpeech(request);
    const audio = response.audioContent;
    return Buffer.from(audio, 'binary').toString('base64');
}

exports.getTTSGoogleResponse = getTTSGoogleResponse;

async function getBotResponse(prompt, teacher, student) {
    const gpt3Response = await getGPT3Response(prompt, teacher, student);

    // if (teacher["TTS"].audioConfig){
    const audioBase64 = await getTTSGoogleResponse(gpt3Response, teacher);
    // }
    // else if (teacher["TTS"].begin) {
    //     const audioBase64 = await getTTSAzureResponse(gpt3Response, teacher);
    // }

    return {gpt3Response, audioBase64};

}


exports.textToResponse = functions.region('europe-west1').https.onRequest(async (req, res) => {
    const {error} = require('../common/validators')
        .validateKeys(req.body, ['teacher', 'student', 'subject', 'text'])
    if (error) {
        res.status(400).send({response: '', prompt: '', audio: '', error: error});
        return;
    }
    const {teacher, student, subject, text} = req.body;
    const prompt = createPrompt(teacher, student, subject, text);

    getBotResponse(prompt, teacher, student)
        .then(({gpt3Response, audioBase64}) => {
            res.status(200).send({response: gpt3Response, prompt: prompt, audio: audioBase64, error: ''});
        }).catch((error) => {
            res.status(500).send({response: '', prompt: prompt, audio: '', error: error});
        }
    )
});
