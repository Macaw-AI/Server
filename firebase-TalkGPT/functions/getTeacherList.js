const functions = require('firebase-functions');


exports.getTeacherList = functions.region('europe-west1').https.onRequest(async (req, res) => {
    if (!req.body?.language) {
        res.status(400).send({listOfTeacher: [], error: "Missing language in request body"});
        return;
    }

    require('./common/download')
        .downloadFiles(`Scenarios/${req.body.language}/teachers/`)
        .then((teacherList) => {
            res.status(200).send({listOfTeacher: teacherList, error: ""});
        }).catch((error) => {
        res.status(500).send({listOfTeacher: [], error: error});
    });
});
