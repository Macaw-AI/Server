const functions = require('firebase-functions');
const {Configuration, OpenAIApi} = require('openai');
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

exports.gpt3response = functions.https.onRequest(async (req,res) => {
    const text = req.body.text;
    const openai = new OpenAIApi(configuration);
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: text,
        temperature: 0.8,
        max_tokens: 1500,
    });
    const gpt3Response = completion.data.choices[0].text;
    res.send({response: gpt3Response})
    
});