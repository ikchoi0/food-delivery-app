// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

// require dotenv variables for twilio
require("dotenv").config();

// define function to take in twilio variables and send the SMS
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

// export function for use in routes
module.exports = { sendSMS };
