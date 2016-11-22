var _ = require('lodash');
var alexa = require('alexa-app');
var intentHandler = require('./intent_handlers');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

var app = new alexa.app('lunch-where');
var intentHandler = new intentHandler();
var YesIntent = intentHandler.yesIntent,
  NoIntent = intentHandler.noIntent,
  HelpIntent = intentHandler.helpIntent,
  RepeatIntent = intentHandler.repeatIntent,
  StopIntent = intentHandler.stopIntent,
  CancelIntent = intentHandler.cancelIntent,
  StartOverIntent = intentHandler.startOverIntent,
  zipIntent = intentHandler.zipIntent,
  cityIntent = intentHandler.cityIntent,
  repickIntent = intentHandler.repickIntent;

app.launch(function (req, res) {
  intentHandler.handleLaunchRequest(req, res);
});

app.intent(YesIntent.name, YesIntent.utterances, function (req, res) {
  YesIntent.callFunc(req, res);
});

app.intent(NoIntent.name, NoIntent.utterances, function (req, res) {
  NoIntent.callFunc(req, res);
});

app.intent(HelpIntent.name, HelpIntent.utterances, function (req, res) {
  HelpIntent.callFunc(req, res);
});

app.intent(StartOverIntent.name, StartOverIntent.utterances, function (req, res) {
  StartOverIntent.callFunc(req, res);
});

app.intent(CancelIntent.name, CancelIntent.utterances, function (req, res) {
  CancelIntent.callFunc(req, res);
});

app.intent(StopIntent.name, StopIntent.utterances, function (req, res) {
  StopIntent.callFunc(req, res);
});

app.intent(RepeatIntent.name, RepeatIntent.utterances, function (req, res) {
  RepeatIntent.callFunc(req, res);
});

app.intent(repickIntent.name, repickIntent.utterances, function (req, res) {
  repickIntent.callFunc(req, res);
});

app.intent(zipIntent.name, zipIntent.utterances, function (req, res) {
  return zipIntent.callFunc(req, res);
});

app.intent(cityIntent.name, cityIntent.utterances, function (req, res) {
  return cityIntent.callFunc(req, res);
});


module.exports = app;
