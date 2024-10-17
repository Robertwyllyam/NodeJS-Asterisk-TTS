import manager from "asterisk-manager";
import { config } from "dotenv";
config();

const {
  ASTERISK_AMI_USER,
  ASTERISK_AMI_HOST,
  ASTERISK_AMI_PORT,
  ASTERISK_AMI_PASSWORD,
} = process.env;

var ami = manager(
  ASTERISK_AMI_PORT,
  ASTERISK_AMI_HOST,
  ASTERISK_AMI_USER,
  ASTERISK_AMI_PASSWORD
);

ami.keepConnected();

// Listen for any/all AMI events.
ami.on("managerevent", function (evt) {
  // console.log("event", evt);
});

// Listen for specific AMI events. A list of event names can be found at
// https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Events
ami.on("hangup", function (evt) {});
ami.on("confbridgejoin", function (evt) {});

// Listen for Action responses.
ami.on("response", function (evt) {});

// Perform an AMI Action. A list of actions can be found at
// https://wiki.asterisk.org/wiki/display/AST/Asterisk+11+AMI+Actions

export async function createCall(from, to, variables) {
  return new Promise((resolve, reject) => {
    ami.action(
      {
        action: "originate",
        channel: `PJSIP/${from}`,
        context: "from-internal",
        exten: to,
        priority: 1,
        variable: variables,
      },
      function (err, res) {
        if (err) return reject(err);
        return resolve(res);
      }
    );
  });
}
