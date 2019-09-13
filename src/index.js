require('dotenv').config();
import getTidepoolNotes from './lib/tidepool';
import NightscoutClient from './lib/nightscout';

const MINUTES_LOOKBACK = process.env.MINUTES_LOOKBACK || 60;

const dt = new Date()
dt.setMinutes( dt.getMinutes() - MINUTES_LOOKBACK );
const startTime = dt.toISOString()
console.log(startTime);

(async () => {
  const tidepoolNotes = await getTidepoolNotes(startTime);

  const ns = new NightscoutClient();
  //const treatments = await ns.getTreatments();
  //console.log(treatments)
  tidepoolNotes.messages.forEach(async n => {
    await ns.upsertTreatment(n)
  })
  
  
})()




