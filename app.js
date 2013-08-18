/**
 * de-captcher nodejs library
 * by Erhan Gundogan <erhan@trposta.net>
 */

var request  = require("request"),
    http     = require("http"),
    mime     = require("mime"),
    fs       = require("fs"),
    path     = require("path"),
    url      = require("url"),
    settings = require("./settings"),
    util     = require("./util"),
    Log      = require("./log").log,
    log      = new Log();


var decaptcher = exports.decaptcher = function(username, password) {
  this.username = username;
  this.password = password;
  this.timeout  = 0;
  this.pictureProcess = 0;
};

/**
 * getBalance
 *   Get you balance credit
 *
 * @param callback
 */
decaptcher.prototype.getBalance = function(callback) {
  var self = this;
  request.post("http://poster.de-captcher.com",
    { form: {
        function: "balance",
        username: self.username,
        password: self.password
      }
    },
    function (error, response, body) {
      if (error) {
        var msg = (new Date()).toLocaleString() + " ==> [ERROR getBalance] ==> " + error;
        if (settings.log) log.write(msg);
        callback(msg);
      } else {
        if (response.statusCode == 200 && body) {
          var balance = Number(body);
          if (settings.log) log.write((new Date()).toLocaleString() + " ==> [INFO getBalance] ==> " + balance);
          callback(null, balance);
        } else {
          if (settings.log) log.write((new Date()).toLocaleString() + " ==> [WARNING getBalance] ==> No result");
          callback(null, -1);
        }
      }
    });
};

/**
 * postPicture
 *   HTTP Post picture to de-captcher
 *
 * @param pictureRequest: HTTP or FileSystem picture file
 *        e.g. https://www.google.com/images/srpr/logo4w.png
 *             ./images/logo4w.png
 * @param mimeType: image/jpeg, image/png etc.
 * @param callback
 */
decaptcher.prototype.postPicture = function(pictureRequest, mimeType, callback) {
  var self = this,
      msg = (new Date()).toLocaleString() + " ==> [INFO postPicture] ==> " + pictureRequest;

  function makeRequest(mimeType, fileName) {
    request({
        url: 'http://poster.de-captcher.com',
        method: 'POST',
        headers: {
          'content-type' : 'multipart/form-data'
        },
        multipart: [{
          'Content-Disposition' : 'form-data; name="function"',
          'body': "picture2"
        }, {
          'Content-Disposition' : 'form-data; name="username"',
          'body': self.username
        }, {
          'Content-Disposition' : 'form-data; name="password"',
          'body': self.password
        } ,{
          'Content-Disposition' : 'form-data; name="pict"',
          'Content-Type' : mimeType,
          'body': fs.readFileSync(fileName)
        }]
      },
      function(error, response, body) {
        if (error) {
          var msg = (new Date()).toLocaleString() + " ==> [ERROR postPicture] ==> " + error;
          if (settings.log) log.write(msg);
          callback(msg);
        } else {
          if (response.statusCode == 200 && body) {
            var items = body.split("|");
            var result = {
              resultCode : items[0],
              majorID    : items[1],
              minorID    : items[2],
              Type       : items[3],
              Timeout    : items[4],
              Text       : items[5]
            };

            if (settings.log) log.write((new Date()).toLocaleString() + " ==> [INFO ReCaptcha] ==> " + JSON.stringify(result, null, 2));
            callback(null, result);
          } else {
            callback(null, -1);
          }
        }
      });
  }

  if (settings.log) log.write(msg);
  console.log(msg);

  if (!callback && mimeType && typeof(mimeType) == "function") {
    callback = mimeType;
    mimeType = null;
  }

  var requestItem = url.parse(pictureRequest),
      webRequest = /^http|^https|^ftp/.test(requestItem.protocol),
      streamFileName = null;

  if (webRequest) {
    var fileName = util.getFileName();

    if (!mimeType) {
      mimeType = mime.lookup(pictureRequest);
    }

    if (!/^image/.test(mimeType)) {
      mimeType = "image/jpeg";
    }

    var extension = mime.extension(mimeType);
    if (extension) {
      fileName += "." + extension;
    }

    streamFileName = path.join(__dirname, ".images", fileName);
    var ws = fs.createWriteStream(streamFileName, {flags:"a"});
    var imageData = null;

    ws.on("open", function(fd) {
      http.request(pictureRequest, function(res) {
        res.on("data", function(chunk) {
          ws.write(chunk);
        });

        res.on("end", function() {
          ws.end();
          var msg = (new Date()).toLocaleString() + " ==> [INFO postPicture SAVE FINISHED]";
          if (settings.log) log.write(msg);
          makeRequest(mimeType, streamFileName);
        });
      });
    });

  } else {
    makeRequest(mime.lookup(pictureRequest), pictureRequest);
  }
};

/**
 * reportBadResult
 *   If captcha result is wrong you can report it with majorID/minorID in result set.
 *
 * @param majorID
 * @param minorID
 * @param callback
 */
decaptcher.prototype.reportBadResult = function(majorID, minorID, callback) {
  var self = this;

  console.log((new Date()).toLocaleString() + " ==> [INFO reportBadResult] ==> " + JSON.stringify(self));

  request({
      url: 'http://poster.de-captcher.com',
      method: 'POST',
      headers: {
        'content-type' : 'multipart/form-data'
      },
      multipart: [{
        'Content-Disposition' : 'form-data; name="function"',
        'body': "picture_bad2"
      }, {
        'Content-Disposition' : 'form-data; name="username"',
        'body': self.username
      }, {
        'Content-Disposition' : 'form-data; name="password"',
        'body': self.password
      } ,{
        'Content-Disposition' : 'form-data; name="major_id"',
        'body': majorID
      } ,{
        'Content-Disposition' : 'form-data; name="minor_id"',
        'body': minorID
      }]
    },
    function(error, response, body) {
      if (error) {
        callback((new Date()).toLocaleString() + " ==> [ERROR reportBadResult] ==> " + error);
      } else {
        if (response.statusCode == 200 && body) {
          var items = body.split("|");
          var result = {
            resultCode : items[0],
            majorID    : items[1],
            minorID    : items[2],
            Type       : items[3],
            Timeout    : items[4],
            Text       : items[5]
          };

          callback(null, result);
        } else {
          callback(null, -1);
        }
      }
    });
};
/**
 * Get system load with percentage
 * e.g. 57%
 *
 * @param callback
 */
decaptcher.prototype.getSystemLoad = function(callback) {
  var self = this;
  request.post("http://poster.de-captcher.com",
    { form: {
      function: "system_load",
      username: self.username,
      password: self.password
    }
    },
    function (error, response, body) {
      if (error) {
        callback((new Date()).toLocaleString() + " ==> [ERROR getSystemLoad] ==> " + error);
      } else {
        if (response.statusCode == 200 && body) {
          var balance = Number(body) + "%";
          callback(null, balance);
        } else {
          callback(null, -1);
        }
      }
    });
};

/**
 * Get your request result message
 *
 * @param value
 * @returns {string}
 */
decaptcher.prototype.getResultCode = function(value) {
  var result = null;
  switch(value) {
    case 0:
      result = "OK";
      break;
    case -1:
      result = "INTERNAL ERROR";
      break;
    case -2:
      result = "STATUS IS NOT CORRECT";
      break;
    case -3:
      result = "NETWORK DATA TRANSFER ERROR";
      break;
    case -4:
      result = "TEXT IS NOT OF AN APPROPRIATE SIZE";
      break;
    case -5:
      result = "SERVER IS OVERLOADED";
      break;
    case -6:
      result = "NOT ENOUGH FUNDS TO COMPLETE THE REQUEST";
      break;
    case -7:
      result = "REQUEST TIMED OUT";
      break;
    case -8:
      result = "PROVIDED PARAMETERS ARE NOT GOOD FOR THIS FUNCTION";
      break;
    case -200:
      result = "UNKNOWN ERROR";
      break;
  }
  return result;
};

/**
 * 0: default timeout, server-specific
 * 1: long timeout for picture, server-specfic
 * 2: 30 seconds timeout for picture
 * 3: 60 seconds timeout for picture
 * 4: 90 seconds timeout for picture
 * @param value
 */
decaptcher.prototype.setTimeouts = function(value) {
  this.timeout = value;
};

/**
 * 0: unspecified
 * 86: ASIRRA pictures
 * 83: TEXT questions
 * 82: MULTIPART quetions
 * @param value
 */
decaptcher.prototype.setPictureProcess = function(value) {
  this.pictureProcess = value;
};

/**
 * 12: ASIRRA
 * 20: MULTIPART
 * @param value
 */
decaptcher.prototype.setMultiPictureProcess = function(value) {
  this.multiPictureProcess = value;
};