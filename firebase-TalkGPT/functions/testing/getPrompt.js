const functions = require('firebase-functions');
const {createPrompt} = require('../production/textToResponse');

exports.getPrompt = functions.region('europe-west1').https.onRequest(async (req, res) => {
    const {error} = require('../common/validators')
        .validateKeys(req.body, ['teacher', 'student', 'subject'])
    if (error) {
        res.status(400).send({prompt: '', error: error});
        return;
    }
    const {teacher, student, subject, text} = req.body;
    const prompt = createPrompt(teacher, student, subject, text);

    res.status(200).send({prompt: prompt, error: ''});
});