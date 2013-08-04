var fs = require("fs"),
    path = require("path");

var log = exports.log = function() {
  return this;
};

log.prototype.getFileName = function() {
  var dt = new Date();
  var fileName = dt.getFullYear()+""+("0"+(dt.getMonth()+1)).slice(-2)+""+("0"+dt.getDate()).slice(-2)+".log";
  return path.join(__dirname, ".log", fileName);
};

log.prototype.write = function(data) {
  var fileName = this.getFileName();
  fs.appendFile(fileName, data, function (err, result) {
    if (err) {
      console.log((new Date()).toLocaleString() + " ==> [ERROR log write] ==> " + err);
    }
  });
};