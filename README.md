# Tidepool notes to Nightscout syncer
Sync Tidepool notes to your Nightscout site

If you or a care taker of the T1D is using the [Tidepool](https://www.tidepool.org/) Mobile app to [add treatment notes](https://support.tidepool.org/hc/en-us/articles/360029369292-Adding-and-deleting-a-note-in-Tidepool-Mobile), and you want them to show up in [Nightscout](https://github.com/nightscout/cgm-remote-monitor), this is the app for you. 

The script will add new treatment notes to Nightscout if it finds them in Tidepool. 

If the notes already exists in NS, then they will be updated with the new text. 

Notes will not be deleted from Nightscout with this script. 

# Requirements

* Node 10+
* A working Tidepool account
* A working Nightscout site (and your API_SECRET)

# Installation

Run `npm install`

Create a file called `.env` in the root folder of this project

Add the following environment variables to the `.env` file:

```
TIDEPOOL_USERNAME=
TIDEPOOL_PASSWORD=
NIGHTSCOUT_URL=https://xxxx.herokuapp.com
NIGHTSCOUT_API_SECRET=
MINUTES_LOOKBACK=60
```

The `MINUTES_LOOKBACK` specify how many minutes the script will look back when fetching new notes from Tidepool.

So if you run this script every hour, you should set it to 60 minutes. 

If you run your script every 10 minutes, set it to 12 minutes to be sure to get all new notes.

# Run

`npm run sync-treatments`

You should run this as a cron job or use Heroku Scheduler to run it every 10 minutes. 

# Deploy to Heroku

1. Create an Heroku app using:

`heroku apps:create tidepool-notes-to-nightscout`

2. Add all the environment variables to your app in Heroku in the *Settings* page under *Reveal Config vars* on your apps Heroku dashboard.

3. Test the script by running `heroku run npm run sync-treatments`

4. Add 'Heroku Scheduler* as add-on under *Resources* 

5. Click the *Heroku Scheduler* link to open the dashboard and click *Create job*

6. Leave it at 10 minutes and add `npm run sync-treatments` under *Run command*. Save the job

7. Watch your apps logs to see that everything worked.

Your Tidepool notes will now be synced with Nightscout every 10 minutes. If you want it to happen more often, you would have to look for a Heroku add-on that lets you run the script more often.
