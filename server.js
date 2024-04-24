const App = require('./App').App;
const io=require("./socketServer");
const Mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, 'config.env') });
Mongoose.connect(process.env.REMOTE_STRING, { family: 4 })
	.then((_) => console.log('DB Connected'))
	.catch((err) => {
		console.log('Mongoose Error :', err);
	});
