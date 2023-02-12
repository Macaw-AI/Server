const functions = require('firebase-functions');

exports.formatter = functions.https.onRequest(async (req,res)=>{
   
    const teacher = req.body.data[0];
    const student = req.body.data[1];
    const subject = req.body.data[2];
    const text = req.body.text;
    const header = `Response as my Teacher (${teacher.name},${teacher.character}). I am your Student(${student.name},${student.age}).
    During our conversation you should ask me about ${subject.name} and ${subject.questions} and let us debate about ${subject.related}.
    Remember to ask ONLY ONE question at the time and be curious obout my opinion and point of view.YOU start the conversation as a teacher. Below is a record of our recent quotes:
    ${teacher.name}: Hi`;
    

    res.send({formatted_text: header +"\n Student: "+ text+`\n${teacher.name}: `});

});