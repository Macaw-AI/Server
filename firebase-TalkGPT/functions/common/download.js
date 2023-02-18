const admin = require("firebase-admin");
admin.initializeApp();

exports.downloadFiles = async function (path, suffix){
    const storage = admin.storage();
    const options = {
        prefix: path,
    };
    console.log("Downloading files from: " + path);
    const [files] = await storage.bucket().getFiles(options);
    let promises = [];
    for (const file of files) {
        if (file.name.endsWith(suffix)) {
            promises.push(file.download().then(data => {
                return JSON.parse(data.toLocaleString());
            }));
        }
    }
    return await Promise.all(promises);
}