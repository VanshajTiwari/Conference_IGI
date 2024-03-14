const Mongoose = require('mongoose');

const InstiSchema = new Mongoose.Schema({
	institution: String,
	institutionAddress: String,
	user: {
		type: Mongoose.Types.ObjectId,
		ref: 'users',
	},
	employID: {
		type: String,
		required: [true, 'ID Must assigned'],
	},
	userAddress: String,
	role: {
		type: String,
		role: [
			'Assistant Professor',
			'student',
			'Professor',
			'Dean',
			'CEO',
			'Registrar',
			'Placement Head',
			'Training Coach',
		],
		required: [true, 'users belongs to Role'],
	},
	mobile: {
		type: Number,
		required: [true, 'number Required'],
	},
});

module.exports = Mongoose.model('institutionschema', InstiSchema);
