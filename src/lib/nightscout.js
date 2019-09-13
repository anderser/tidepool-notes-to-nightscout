require('dotenv').config();
const crypto = require('crypto');
const axios = require('axios');

class NightscoutClient {
  createApiHash() {
    const shasum = crypto.createHash('sha1');
    const hash = shasum.update(process.env.NIGHTSCOUT_API_SECRET);
    return hash.digest('hex');
  }

  /* Generic function for GET request against Nighscout API */
  async invokeNSEndpoint(endpoint, method, postData = null) {
    let axiosConfig = {
      headers: {
        'api-secret': this.createApiHash(),
        'Content-Type': 'application/json',
      },
      method: method,
    };

    if (['put', 'post'].includes(method)) {
      axiosConfig.data = postData;
    }
    const nsUrl = process.env.NIGHTSCOUT_URL;
    const url = `${nsUrl}${endpoint}`;
    //console.log(url);
    const response = await axios.request(url, axiosConfig);
    return response.data;
  }

  async getTreatments() {
    return await this.invokeNSEndpoint('/api/v1/treatments', 'get');
  }

  async findTreatments(dateString) {
    const endpoint = `/api/v1/treatments.json?find[created_at][$eq]=${dateString}`;
    return await this.invokeNSEndpoint(endpoint, 'get');
  }

  async addTreatment(nsTreatment) {
    return await this.invokeNSEndpoint(
      '/api/v1/treatments',
      'post',
      nsTreatment
    );
  }

  async updateTreatment(nsTreatment) {
    return await this.invokeNSEndpoint(
      '/api/v1/treatments',
      'put',
      nsTreatment
    );
  }

  tidepoolNoteToNSTreatment(tidepoolNote) {
    const { id, timestamp, createdtime, messagetext, user } = tidepoolNote;

    const createdAtISO = new Date(createdtime).toISOString();
    return {
      enteredBy: user.fullName,
      eventType: 'Note',
      notes: messagetext,
      created_at: createdAtISO,
      eventTime: createdAtISO,
      utcOffset: 0,
      carbs: null,
      insulin: null,
      reason: '',
      protein: '',
      fat: '',
      duration: 0,
    };
  }

  async upsertTreatment(tidepoolNote) {
    // Format Tidepool note to NS Treatment
    const nsTreatment = this.tidepoolNoteToNSTreatment(tidepoolNote);
    // Check if treatment already exists

    const findTimestamp = nsTreatment.created_at;
    //const findTimestamp = '2019-09-12T19:58:35.905Z';

    const treatments = await this.findTreatments(findTimestamp);
    //const exists = await this.findTreatment();
    if (treatments.length > 0) {
      // If it exists, then check if text has changed and if so, update NS

      const exsistingTreatment = treatments[0];

      if (exsistingTreatment.notes !== nsTreatment.notes) {
        nsTreatment._id = exsistingTreatment._id;
        console.log(`Treatment ${findTimestamp} updated. Putting to NS.`);
        const resp = await this.updateTreatment(nsTreatment);
      } else {
        console.log(
          `Treatment ${findTimestamp} already exists and is not changed`
        );
      }
    } else {
      // If it does not exists, post new treatment to NS
      console.log(`Treatment ${findTimestamp} does not exist. Posting to NS.`);
      const resp = await this.addTreatment(nsTreatment);
    }

    return null;
  }
}

export default NightscoutClient;
