const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.getTeacherList = functions.https.onRequest(async (req, res) => {
  const storage = admin.storage();
  const options = {
    prefix: `Scenarios/${req.body.data["language"]}/teachers/`,
  };

  const [files] = await storage.bucket().getFiles(options);
  let promises = [];
  for (const file of files) {
    if(file.name.endsWith('.json')){
        promises.push(file.download().then(data => {
        return JSON.parse(data.toLocaleString());
    }));
    }
    
  }

  const teacherList = await Promise.all(promises);
  res.status(200).send({ listOfTeacher: teacherList });
  
});