const { getAppointments } = require('./appointments');

const express = require('express');

const router = express.Router();

var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

let newRsp = `
    <Response>
        <Say voice="man" language="google.en-US-Wavenet-A">Please record your message after the tone and finish with hash key</Say>
        <Record action="/recorded" maxLength="30" finishOnKey="#" />
    </Response>
`;

router.post('/', async (req, res, next) => {

    let appointment = await getAppointments();

    if (!appointment) {
        res.status(200).set('Content-Type', 'application/xml').send(newRsp);

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
});

router.post('/recorded', (req, res, next) => {
    console.log("recorded body", req.body);
    let response = `
        <Response>
            <Say voice="man" language="google.en-US-Wavenet-A">
                &lt;speak&gt;
                    Your call was recorded and will be forwarded to a support agent
                &lt;/speak&gt;
            </Say>
            <Email from="mkulpok@gmail.com" to="mmethod@windowslive.com" subject="${req.body.CallSid}">
                Call information:

                From: ${req.body.From}
                To: ${req.body.To}
                Message left on: ${req.body.CallTimestamp}
                Please check: ${req.body.RecordingUrl}
            </Email>
            <Pause length="1" />
        </Response>
    `;

    res.status(200).set('Content-Type', 'application/xml').send(response);
});

module.exports = router;
