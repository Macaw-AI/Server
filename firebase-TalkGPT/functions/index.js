const gpt3response = require('./gpt3response');
const formatter = require('./formatter');
const tts = require('./tts');
const text_to_response = require('./text_to_response')
const getTeacherList = require("./getTeacherList")

exports.gpt3response = gpt3response.gpt3response;
exports.formatter = formatter.formatter;
exports.tts = tts.tts;
exports.text_to_response = text_to_response.text_to_response;
exports.getTeacherList = getTeacherList.getTeacherList;