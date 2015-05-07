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

module.exports = (robot) ->
  robot.respond /xkcd( current)?$/i, (res) ->
    robot.http('http://xkcd.com/info.0.json').get() (err, response, body) ->
      throw err if err
      data = JSON.parse(body)
      res.send "#{data.title}: #{data.img}"

  robot.respond /xkcd random$/i, (res) ->
    robot.http('http://xkcd.com/info.0.json').get() (err, response, body) ->
      throw err if err
      maxNum = JSON.parse(body).num
      randNum = res.random [1..maxNum]
      robot.http("http://xkcd.com/#{randNum}/info.0.json").get() (err, response, body) ->
        data = JSON.parse(body)
        res.send "#{data.title}: #{data.img}"

  robot.respond /xkcd (\d+)/i, (res) ->
    robot.http("http://xkcd.com/#{res.match[1]}/info.0.json").get() (err, response, body) ->
      if response.statusCode is 404
        res.send 'This comic doesn\'t exist'
      else
        data = JSON.parse body
        res.send "#{data.title}: #{data.img}"
