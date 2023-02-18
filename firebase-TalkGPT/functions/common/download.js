const admin = require("firebase-admin");
admin.initializeApp();

async function getFiles(options) {
    const storage = admin.storage();
    return await storage.bucket().getFiles(options)
}

async function getJsonFromFile(file) {
    return await file.download().then(data => {
        return JSON.parse(data.toLocaleString());
    });
}

exports.downloadFiles = async function (path) {
    const [files] = await getFiles({prefix: path});

    let promises = [];
    for (const file of files) {
        if (file.name.endsWith('.json')) {
            promises.push(getJsonFromFile(file));
        }
    }
    return await Promise.all(promises);
}

exports.downloadFile = async function (path) {
    const [files] = await getFiles({prefix: path});
    const file = files[0];

    if (file.name.endsWith('.json')) {
        return await getJsonFromFile(file);
    }
}