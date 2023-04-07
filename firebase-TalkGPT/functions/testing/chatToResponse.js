const functions = require('firebase-functions');
const {Configuration, OpenAIApi} = require('openai');

const {getTTSGoogleResponse, createPrompt} = require("../production/textToResponse");


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});


const CHAT_MODELS = [
    "gpt-3.5-turbo",
    "gpt-3.5-turbo-0301",
]

async function getGPTMessage(prompt, chat) {
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createChatCompletion({
        model: CHAT_MODELS[0],
        messages: [{role: "system", content: prompt}].concat(chat),
        temperature: 0.80,
        max_tokens: 1500,
    });
    return completion.data.choices[0].message;
}

// function based on getBotResponse from ./textToResponse.js
async function getBotResponse(prompt, teacher, chat) {
    const gptMessage = await getGPTMessage(prompt, chat);
    chat.push(gptMessage);
    // if (teacher["TTS"].audioConfig){
    const audioBase64 = await getTTSGoogleResponse(gptMessage.content, teacher);
    // }
    // else if (teacher["TTS"].begin) {
    //     const audioBase64 = await getTTSAzureResponse(gpt3Response, teacher);
    // }

    return {audioBase64};

}

exports.chatToResponse = functions.region('europe-west1').https.onRequest(async (req, res) => {
    const {error} = require('../common/validators')
        .validateKeys(req.body, ['teacher', 'student', 'subject', 'chat'])
    if (error) {
        res.status(400).send({message: '', audio: '', error: error});
        return;
    }
    const {teacher, student, subject, chat} = req.body;
    const prompt = createPrompt(teacher, student, subject, "");

    getBotResponse(prompt, teacher, chat)
        .then(({audioBase64}) => {
            res.status(200).send({chat: chat, audio: audioBase64, error: ''});
        }).catch((error) => {
        res.status(500).send({chat: chat, audio: '', error: error});
    })
});
