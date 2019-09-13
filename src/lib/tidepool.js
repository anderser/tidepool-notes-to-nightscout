
require('dotenv').config()
const axios = require('axios');

async function getTidepoolNotes(startTime='2019-01-01T00:00:00.000Z', endDate=null) {
  const apiHost = 'https://api.tidepool.org';
  const axiosConfig = {
    auth: {
      username: process.env.TIDEPOOL_USERNAME,
      password: process.env.TIDEPOOL_PASSWORD,
    },
  };
  const response = await axios.post(`${apiHost}/auth/login`, null, axiosConfig);
  const userId = response.data.userid;
  const sessionToken = response.headers['x-tidepool-session-token'];
  console.log(sessionToken)
  const dataResponse = await axios.get(`${apiHost}/message/notes/${userId}?starttime=${startTime}`, {
    headers: {
      'x-tidepool-session-token': sessionToken,
    },
  });
  return dataResponse.data;
}

export default getTidepoolNotes;