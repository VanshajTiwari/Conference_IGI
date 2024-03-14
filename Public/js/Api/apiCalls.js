const BASE_URL = 'http://127.0.0.1:7575/';
const getMessage = async () => {
	const res = await axios({
		method: 'GET',
		url: `${BASE_URL}/chats/showmsg`,
	});

	return res.data.chats;
};
const sendMsg = async (sender, message) => {
	console.log(sender);
	const res = await axios({
		method: 'POST',
		url: `${BASE_URL}/chats/sendmsg`,
		data: { sender, message },
	});

	return res;
};
