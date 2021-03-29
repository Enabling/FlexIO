const { google } = require('googleapis');
const scopes = ['https://www.googleapis.com/auth/calendar'];
const client = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes,
});
const calendar = google.calendar({ version: 'v3', auth: client });

const sdate = new Date();
const sdate2 = new Date();
sdate2.setDate(sdate.getDate() + 1);
const isDateBeforeToday = (date) => new Date(date) < new Date();

function getAppointments() {
  return new Promise((resolve, reject) => retrieveAppointments(resolve, reject));
}

function retrieveAppointments(resolve, reject) {
  calendar.events.list(
    {
      calendarId: 'mkulpok@gmail.com',
      timeMin: sdate.toISOString(),
      timeMax: sdate2.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    },
    (err, res) => {
      if (err) {
        console.log(`The API returned an error: ${err}`);
        reject(err);
      }
      const appointments = res.data.items
        .filter((appointment) => isDateBeforeToday(appointment.start.dateTime))
        .map((appointment) => ({
          start: appointment.start.dateTime,
          end: appointment.end.dateTime,
          id: appointment.id,
          status: appointment.status,
          creator: appointment.creator,
          description: appointment.description,
        })
        );
      resolve(appointments.find(obj => obj.description != ""));
    }
  );
}
module.exports = { getAppointments };
