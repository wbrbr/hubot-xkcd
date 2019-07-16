process.env.EXPRESS_PORT = process.env.PORT = 0;

const Helper = require("hubot-test-helper");
const fs = require('fs');
require("should");

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const scriptHelper = new Helper("../lib/xkcd.js");
describe('pugme', function() {
  beforeEach(() => {
    room = scriptHelper.createRoom();
    room.robot.http = (url) => ({
      get: () => (cb) => {
        const err = null;
        const response = {
          statusCode: 404
        };
        let body = ""
        if (url === 'https://relevantxkcd.appspot.com/process?action=xkcd&query=compiling') {
          response.statusCode = 200
          body = fs.readFileSync('./test/fixtures/relevantxkcd/compiling.txt').toString();
        } else if (url === 'https://xkcd.com/303/info.0.json') {
          response.statusCode = 200
          body = fs.readFileSync('./test/fixtures/xkcd/303.json').toString();
        } else {
          throw new Error(url)
        }
        cb(err, response, body);
      }
    })
  });
  afterEach(() => { room.destroy(); });

  describe("help", () => {
    it("lists help", () => {
      room.robot.helpCommands().should.eql([
        "hubot xkcd (current) - send a link to the last XKCD comic",
        "hubot xkcd <number> - send a link to the specified XKCD comic",
        "hubot xkcd random - send a link to a random XKCD comic",
        "hubot xkcd relevant <prase> - Find the xkcd comic that most suites the phrase(s)"
      ]);
    });
  });
  describe("xkcd relevant compiling", () => {
    it("should return comic 303", () => {
      return room.user.say("Shell", "hubot xkcd relevant compiling")
        .then(() => {
          room.messages.should.be.eql([
            [ "Shell", "hubot xkcd relevant compiling" ],
            [ "hubot", "Compiling" ],
            [ "hubot", "https://imgs.xkcd.com/comics/compiling.png" ],
            [ "hubot", "'Are you stealing those LCDs?' 'Yeah, but I'm doing it while my code compiles.'" ]
          ])
        });
    });
  });
});
