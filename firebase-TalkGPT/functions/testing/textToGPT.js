const functions = require("firebase-functions");


const {createPrompt, getGPT3Response} = require('../production/textToResponse');

exports.textToGPT = functions.https.onRequest(async (req, res) => {
    const {error} = require('../common/validators')
        .validateKeys(req.body, ['teacher', 'student', 'subject'])
    if (error) {
        res.status(400).send({response: '', prompt: '', error: error});
        return;
    }
    const {teacher, student, subject} = req.body;
    const prompt = createPrompt(teacher, student, subject);

    getGPT3Response(prompt, teacher, student)
        .then(({gpt3Response, audioBase64}) => {
            res.status(200).send({response: gpt3Response, prompt: prompt, error: ''});
        }).catch((error) => {
            res.status(500).send({response: '', prompt: prompt, error: error});
        }
    )
});