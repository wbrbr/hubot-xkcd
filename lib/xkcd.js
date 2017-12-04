// Description:
//  Get links to XKCD comics with Hubot"
//
// Commands:
//  hubot xkcd (current) - send a link to the last XKCD comic
//  hubot xkcd random - send a link to a random XKCD comic
//  hubot xkcd <number> - send a link to the specified XKCD comic
//
// Author:
//  nounoursheureux

const url = 'https://xkcd.com';

const sendComic = function(res, body) {
  const data = JSON.parse(body);
  return res.send(data.title, data.img, data.alt);
};


// get random in in range (min and max included)
const getRandIntRange = function(min, max) {
  return Math.floor(Math.random() * (max-min+1)) + min;
};

module.exports = function(robot) {
  robot.respond(/xkcd( current)?$/i, res =>
    robot.http(`${url}/info.0.json`).get()(function(err, response, body) {
      if (err) { throw err; }
      return sendComic(res, body);
    })
  );

  robot.respond(/xkcd random$/i, res =>
    robot.http(`${url}/info.0.json`).get()(function(err, response, body) {
      if (err) { throw err; }
      const maxNum = JSON.parse(body).num;
      const randNum = getRandIntRange(1, maxNum);
      return robot.http(`${url}/${randNum}/info.0.json`).get()((err, response, body) => sendComic(res, body));
    })
  );

  return robot.respond(/xkcd (\d+)/i, res =>
    robot.http(`${url}/${res.match[1]}/info.0.json`).get()(function(err, response, body) {
      if (response.statusCode === 404) {
        return res.send('This comic doesn\'t exist');
      } else {
        return sendComic(res, body);
      }
    })
  );
};