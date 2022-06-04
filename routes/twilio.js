// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

require("dotenv").config();

var client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);

client.messages
  .create({
     body: 'This is a test',
     from: '+18647193836',
     to: '+16042670097'
   })
  .then(message => console.log(message.sid));
