
const textToResponse = require('./production/textToResponse');
const getTeacherList = require("./production/getTeacherList");
const getSubjectList = require("./production/getSubjectList");

exports.textToResponse = textToResponse.textToResponse;
exports.getTeacherList = getTeacherList.getTeacherList;
exports.getSubjectList = getSubjectList.getSubjectList;


const textToText = require("./testing/textToGPT");
const getPrompt = require("./testing/getPrompt");
const chatToResponse = require("./testing/chatToResponse");

exports.textToGPT = textToText.textToGPT;
exports.getPrompt = getPrompt.getPrompt;
exports.chatToResponse = chatToResponse.chatToResponse;
