const functions = require('firebase-functions');
const textToSpeech = require('@google-cloud/text-to-speech');

exports.tts = functions.https.onRequest(async (req, res) => {
    const { text } = req.body;
    const client = new textToSpeech.TextToSpeechClient();

    const request = {
      input: { text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };
  
    const [response] = await client.synthesizeSpeech(request);
    const audio = response.audioContent;
    const audioBase64 = Buffer.from(audio, 'binary').toString('base64');
  
    res.status(200).send({ audio: audioBase64 });
  });