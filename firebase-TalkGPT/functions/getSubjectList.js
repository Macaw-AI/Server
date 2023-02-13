const functions = require('firebase-functions');
const admin = require('firebase-admin');


exports.getSubjectList = functions.https.onRequest(async (req, res) => {
  const storage = admin.storage();
  const options = {
    prefix: `Scenarios/${req.body.data["language"]}/subjects/`,
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

  const subjectList = await Promise.all(promises);
  res.status(200).send({ listOfSubjects: subjectList });
  
});