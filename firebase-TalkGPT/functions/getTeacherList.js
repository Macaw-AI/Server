const functions = require('firebase-functions');


exports.getTeacherList = functions.https.onRequest(async (req, res) => {
    const {error} = require('./common/validators')
        .validateKeys(req.body, ['language'])
    if (error) {
        res.status(400).send({listOfTeacher: [], error: error});
        return;
    }

    require('./common/download')
        .downloadFiles(`Scenarios/${req.body.language}/teachers/`, '.json')
        .then((teacherList) => {
            res.status(200).send({listOfTeacher: teacherList});
        }).catch((error) => {
        res.status(500).send({listOfTeacher: [], error: error});
    });
});