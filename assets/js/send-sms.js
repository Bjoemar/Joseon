// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILI_AUTH_TOKEN;

require('dotenv').load();
var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);

client.message.create({
	to : process.env.MY_PHONE_NUMBER,
	from : '+12055574646',
	body : 'THIS IS A TEST'
}).then((message)=>console.log(message.sid))