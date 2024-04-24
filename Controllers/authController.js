const Users = require('./../Models/users');
const jwt = require('jsonwebtoken');
const crypt = require('crypto');
const sendEmail = require('./../utils/sendEmail');
const institutionModel = require('./../Models/institutionModel');
const slug = require('slug');
function generateToken(id) {
	let option = {
		expiresIn: '1h',
	};
	token = jwt.sign({ id: id }, process.env.SECRET, { expiresIn: '2000s' });
	return token;
};
exports.login = async (req, res) => {
	try {

		const { email, password } = req.body;
		let user = await Users.findOne({ email })
			.select('+password verified')
			.populate('InstitutionDetails')
			.populate('ownMeetings');
	
		if (!user || !(await user.correctPassword(password, user.password))) {
			res.status(200).json({
				status: 'Fail',
				message: 'Email or Password is Wrong',
			});
			return;
		}
		token = generateToken(user.id);
		res.cookie('jwt', token, { secure: true });

		req.session.user = user;
		if (!user.InstitutionDetails[0])
			return res.redirect('/dashboard/profile/filldetails');
		if(!user.verified)
			return res.render("notActivated.ejs",{user});
		
		return res.redirect('/dashboard/chats');
	} catch (err) {
		console.log(err);
		return res.status(200).json({ status: 'failed', Error: err.message });
	}
};
exports.signup = async (req, res) => {
	const { fullname, email, password, confirmpassword } = req.body;
	const data = await Users.create({
		fullname,
		email,
		password,
		confirmpassword,
	});
	token = generateToken(data.id);
	req.session.user = data;
	res.cookie('jwt', token, { secure: true });
	return res.redirect('/dashboard/profile/filldetails');
};
exports.fillD = async (req, res) => {
	try {
		const {
			institution,
			institutionAddress,
			userAddress,
			username,
			role, 
			mobile,
			TimeZone,
		} = req.body;
		const user = req.session.user;
		const employID = slug(institution) + '-' + req.session.user.id;
		const { InstitutionDetails } = await Users.findById(
			req.session.user.id
		).populate('InstitutionDetails');
		if (InstitutionDetails[0]) {
			const instiDetails = await institutionModel.findOne({ user });
			
			const newDat = await institutionModel.updateOne(
				{ _id: instiDetails.id },
				{
					user,
					employID,
					institution,
					institutionAddress,
					userAddress,
					username,
					role,
					mobile,
					TimeZone,
				}
			);
			return res.status(200).json({ status: 'UPDATED', newDat });
		}
		const inst = new institutionModel({
			employID,
			user,
			institution,
			institutionAddress,
			userAddress,
			username,
			role,
			mobile,
			TimeZone,
		});
		await inst.save();
		req.session.destroy();
		user.InstitutionDetails=[inst];
		sendEmail.getVerified({
			data: user,
			url:`${req.protocol}://${req.get('host')}`,
			subject: 'Approve Account',
			message: `Request for Approval`,
		});

		
		res.render('notActivated.ejs',{user});
	} catch (err) {
		res.status(400).json({ status: 'error', message: err });
	}
};
exports.getVerified=async(req,res)=>{
	const {id}=req.params;
	const user=await Users.findByIdAndUpdate(id,{verified:true});
	res.status(200).json({status:"success",message:"User is Approved"});
}
exports.logout = async (req, res) => {
	res.cookie('jwt', '');
	req.session.destroy();
	res.redirect('/');
};
exports.isLoggedin = (req, res, next) => {
	if (!req.session.user) {
		return res.redirect('/login');
	}
	return next();
};
exports.protect = async (req, res, next) => {
	try {
		if (!req.cookies || !req.cookies.jwt) {
			res.status(200).json({ status: 'failed', message: 'unauthorised' });
			return;
		}
		token = req.cookies.jwt;
		const decoded = await jwt.verify(token, process.env.SECRET);
		const fresherUser = await Users.findOne({ _id: decoded.id });
		if (!fresherUser) {
			res.status(200).json({
				status: 'Failed',
				Error: 'USERS NO LONGER EXIST',
			});
			return;
		}
		req.user = fresherUser;
		res.locals.users = fresherUser;
		next();
	} catch (err) {
		res.status(404).json({ status: 'failed', ERROR: err.message });
	}
};
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role))
			return res.status(200).json({ token: 'YOU DONT HAVE ACCESS' });
		next();
	};
};
exports.forgetPassword = async (req, res) => {
	//1)GET User based on posted email
	const user = await Users.findOne({ email: req.body.email });
	if (!user)
		res.status(200).json({ status: 'fail', message: 'Email not Exist' });

	//2)Genearte the random reset token
	const token = await user.resetPassword();
	user.save({ validateBeforeSave: false });
	//3)send it to user's email

	sendEmail.sendMail({
		email: user.email,
		subject: 'Password reset Token',
		message: `THIS is message is for reset Link reset Token:${
			req.protocol
		}://${req.get('host')}${req.originalUrl}/${token}`,
	});
	res.status(200).json({
		status: 'success',
		message: 'Reset EndPoint Sended to Mail trap',
	});
};
exports.resetForgotPassword = async (req, res) => {
	const { password, confirmpassword } = req.body;
	const { token } = req.params;
	const passswordResetToken = crypt
		.createHash('sha256')
		.update(token)
		.digest('hex');
	const users = await Users.findOne({ passswordResetToken });
	// console.log(users);
	users.password = password;
	users.confirmpassword = confirmpassword;
	users.save();
	res.send('Done!');
};
exports.updatePassword = async (req, res) => {
	try {
		const { id } = req.params;
		const { currpassword, password, confirmpassword } = req.body;
		const users = await Users.findById(id).select('+password');
		// console.log(users);
		if (!users.correctPassword(currpassword, users.password)) {
			res.send('password Incorrect');
		}

		users.password = password;
		users.confirmpassword = confirmpassword;
		users.save();
		res.redirect('/dashboard/profile');
	} catch (err) {
		res.status(400).json({ status: 'fail', Error: err.message });
	}
};
