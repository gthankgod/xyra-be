// services/sendmail.js
const axios = require('axios');
const config = require('../config')

const API_KEY = config.mailer_send_api_key;
const FROM_EMAIL = config.mailer_send_from_email;

console.log("FROM_EMAIL:", FROM_EMAIL); // should print an actual email
console.log("API_KEY:", API_KEY ? 'Loaded ✅' : 'Missing ❌');

exports.sendTransactionalMail = async ({ first_name, aiResponse, to }) => {
  let payload = {
    from: { email: FROM_EMAIL },
    to: [{ email: to }],
    template_id: 'pr9084zjo9mgw63d',
  };

  payload['personalization'] = [{ email: to }];
  payload['personalization'][0]['data'] = {};

  if(aiResponse){
    payload['personalization'][0]['data']['first_name'] = first_name?.toUpperCase();
    payload['personalization'][0]['data']['description'] = aiResponse['description']['heading']?.toUpperCase();
    payload['personalization'][0]['data']['content'] = aiResponse['description']['content'];
    payload['personalization'][0]['data']['personality_type'] = aiResponse['personality']?.toUpperCase();

    if(aiResponse['superpowers']){
      for(let i = 0; i < aiResponse['superpowers'].length; i++){
        payload['personalization'][0]['data']['superpower_' + (i+1)] = aiResponse['superpowers'][i];
      }
    }
    if(aiResponse['challenges']){
      for(let i = 0; i < aiResponse['challenges'].length; i++){
        payload['personalization'][0]['data']['challenge_' + (i+1)] = aiResponse['challenges'][i];
      }
    }
    if(aiResponse['find_balance']){
      for(let i = 0; i < aiResponse['find_balance'].length; i++){
        payload['personalization'][0]['data']['balance_tip_' + (i+1)] = aiResponse['find_balance'][i];
      }
    }
  }



  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  };

  const response = await axios.post('https://api.mailersend.com/v1/email', payload, { headers });
  return response.data;
};
