const functions = require('firebase-functions');

exports.getSubjectList = functions.region('europe-west1').https.onRequest(async (req, res) => {
    const {error} = require('./common/validators')
        .validateKeys(req.body, ['language', 'teacher'])
    if (error) {
        res.status(400).send({listOfSubjects: [], error: error});
        return;
    }

    const download = require('../common/download');
    const teacher = await download.downloadFile(`Scenarios/${req.body.language}/teachers/${req.body.teacher}.json`)
    const subjectList = teacher["related_subjects"];

    let subjectsPromises = [];
    let errors = [];
    let subjects = [];

    for (const subjectName of subjectList) {
        subjectsPromises.push(download.downloadFile(`Scenarios/${req.body.language}/subjects/${subjectName}`));
    }
    subjectsPromises.forEach((subjectPromise) => {
        subjectPromise.then((subject) => {
            subjects.push(subject);
        }).catch((error) => {
            errors.push(error);
        });
    });
    await Promise.all(subjectsPromises);

    if (subjects.length > 0) {
        res.status(200)
    } else {
        res.status(500)
    }
    res.send({listOfSubjects: subjects, error: errors.join(", ")});

});