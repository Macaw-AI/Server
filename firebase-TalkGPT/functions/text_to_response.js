const functions = require('firebase-functions');
const {Configuration, OpenAIApi} = require('openai');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const textToSpeech = require('@google-cloud/text-to-speech');

exports.text_to_response = functions.https.onRequest(async (req,res)=>{
    const teacher = req.body.data[0];
    const student = req.body.data[1];
    const subject = req.body.data[2];
    const text = req.body.text;
    const header = `Response as my Teacher (${teacher.name},${teacher.character}). I am your Student(${student.name},${student.age}).
    During our conversation you should ask me about ${subject.name} and ${subject.questions} and let us debate about ${subject.related}.
    Remember to ask ONLY ONE question at the time and be curious obout my opinion and point of view.YOU start the conversation as a teacher. Below is a record of our recent quotes:
    ${teacher.name}: Hi`;

   
    const formatted_text = header + `\nStudent: `+ text+ `\n${teacher.name}: `;
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: formatted_text,
        temperature: 0.8,
        max_tokens: 1500,
 //       stop: [`${teacher.name}:`,`${student.name}:`,"Student:"],
    });
    const gpt3Response = completion.data.choices[0].text;
    const client = new textToSpeech.TextToSpeechClient();
    const request = {
        input: { text: gpt3Response },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
      };
    
      const [response] = await client.synthesizeSpeech(request);
      const audio = response.audioContent;
      const audioBase64 = Buffer.from(audio, 'binary').toString('base64');
    
      res.status(200).send({response: gpt3Response, prompt: formatted_text,audio: audioBase64});
});