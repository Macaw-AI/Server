exports.validateKeys = function (body, demanded) {
    let errors = [];
    for (let i = 0; i < demanded.length; i++) {
        if (!body[demanded[i]]) {
            errors.push(demanded[i]);
        }
    }
    if (errors.length > 0) {
        return {error: "Missing parameters: " + errors.join(", ")};
    }
    return {error: null};
}

