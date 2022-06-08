// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

require("dotenv").config();

// const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);


const sendSMS = function(phone, message,
  TWILIO_PHONE = process.env.TWILIO_PHONE,
  TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
  TWILIO_TOKEN = process.env.TWILIO_TOKEN) {
  const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_TOKEN);

  client.messages
    .create({
      body: message,
      from: TWILIO_PHONE,
      to: phone
    })
    .then(message => console.log(message.sid));
};


module.exports = { sendSMS };








// client.messages
//   .create({
//      body: 'This is a test',
//      from: '+18647193836',
//      to: '+16042670097'
//    })
//   .then(message => console.log(message.sid));
