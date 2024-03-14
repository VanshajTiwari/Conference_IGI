const Express = require('express');
const Route = Express.Router();
const meetingControllers = require('./../Controllers/meetingController');

Route.get('/', meetingControllers.getMeetings);
Route.post('/addmeeting', meetingControllers.createMeeting);

module.exports = Route;
