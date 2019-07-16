var fs = require('fs');
var path = require('path');

module.exports = function(robot) {
  var scripts_path = path.resolve(__dirname, 'lib');
  return [
    robot.loadFile(scripts_path, 'xkcd.js')
  ];
};
