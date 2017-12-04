/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
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
      const randNum = res.random(__range__(1, maxNum, true));
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

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}