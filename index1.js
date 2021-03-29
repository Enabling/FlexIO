const { getAppointments } = require('./appointments');
const { mail } = require('./mails');

const express = require('express');

const router = express.Router();

var bodyParser = require('body-parser');

var initialpath = "";

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let rsp = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
    "<Response>\n" +
    "   <Say voice=\"man\" language=\"google.en-US-Wavenet-A\">\n" +
    "       &lt;speak&gt;\n" +
    "           Please record your message after the tone and finish with hash key.\n" +
    "       &lt;/speak&gt;\n" +
    "   </Say>\n" +
    "   <Record action=\"" + initialpath + "/recorded" + "\" maxLength=\"30\" finishOnKey=\"#\">\n" +
    "   </Record>\n" +
    "</Response>";

let rsp2 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
    "<Response>\n" +
    "   <Say voice=\"man\" language=\"google.en-US-Wavenet-A\">\n" +
    "       &lt;speak&gt;\n" +
    "           Your call was recorded and will be forwarded to a support agent.\n" +
    "       &lt;/speak&gt;\n" +
    "   </Say>\n" +
    "</Response>";

router.post('/', async (req, res, next) => {

    let appointment = await getAppointments();

    if (!appointment) {
        res.status(200).set('Content-Type', 'application/xml').send(rsp);

    } else {
        var number = appointment.description;

        res.status(200).set('Content-Type', 'application/xml').send("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
            "<Response>\n" +
            "   <Say voice=\"man\" language=\"google.en-US-Wavenet-A\">\n" +
            "&lt;speak&gt;\n" +
            "Call transfer to support agent &quot;&lt;say-as interpret-as=&quot;ordinal&quot;&gt;&quot;&quot;&lt;/say-as&gt;&quot;\n" +
            "&lt;/speak&gt;\n" +
            "   </Say>\n" +
            "   <Dial><Number>" + number + "</Number></Dial>\n" +
            "</Response>");
    }

    run({
        "name": { "from": req.body.From, "to": number },
        "ts": { "date": new Date() }
    });

});

router.post('/recorded', async (req, res, next) => {
    console.log(req.body);
    await mail(req.body.CallSid, req.body.From, req.body.To, req.body.CallTimestamp, req.body.PublicRecordingUrl);
    res.status(200).set('Content-Type', 'application/xml').send(rsp2);
});

module.exports = router;
