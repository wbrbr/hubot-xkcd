# Description:
#  Get links to XKCD comics with Hubot"
#
# Commands:
#  hubot xkcd (current) - send a link to the last XKCD comic
#  hubot xkcd random - send a link to a random XKCD comic
#  hubot xkcd <number> - send a link to the specified XKCD comic
#
# Author:
#  nounoursheureux

url = 'https://xkcd.com'

sendComic = (res, body) ->
  data = JSON.parse body
  res.send data.title, data.img, data.alt

module.exports = (robot) ->
  robot.respond /xkcd( current)?$/i, (res) ->
    robot.http("#{url}/info.0.json").get() (err, response, body) ->
      throw err if err
      sendComic res, body

  robot.respond /xkcd random$/i, (res) ->
    robot.http("#{url}/info.0.json").get() (err, response, body) ->
      throw err if err
      maxNum = JSON.parse(body).num
      randNum = res.random [1..maxNum]
      robot.http("#{url}/#{randNum}/info.0.json").get() (err, response, body) ->
        sendComic res, body

  robot.respond /xkcd (\d+)/i, (res) ->
    robot.http("#{url}/#{res.match[1]}/info.0.json").get() (err, response, body) ->
      if response.statusCode is 404
        res.send 'This comic doesn\'t exist'
      else
        sendComic res, body
