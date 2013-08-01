var request  = require("request"),
    mime     = require("mime"),
    fs       = require("fs"),
    url      = require("url");


var decaptcher = exports.decaptcher = function(username, password) {
  this.username = username;
  this.password = password;
  this.timeout  = 0;
  this.pictureProcess = 0;
};

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
        callback((new Date()).toLocaleString() + " ==> [ERROR getBalance] ==> " + error);
      } else {
        if (response.statusCode == 200 && body) {
          var balance = Number(body);
          callback(null, balance);
        } else {
          callback(null, -1);
        }
      }
    });
};

/**
 * pictureRequest: HTTP or FileSystem picture file
 * e.g. https://www.google.com/images/srpr/logo4w.png
 *      ./images/logo/logo4w.png
 * @param pictureRequest
 * @param callback
 */
decaptcher.prototype.postPicture = function(pictureRequest, callback) {
  var self = this;
  console.log((new Date()).toLocaleString() + " ==> [INFO postPicture] ==> " + JSON.stringify(self));

  var requestItem = url.parse(pictureRequest),
      webRequest = requestItem.protocol == http  ||
                   requestItem.protocol == https ||
                   requestItem.protocol == ftp;

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
        'Content-Type' : mime.lookup(pictureRequest),
        'body': webRequest ? request(pictureRequest) : fs.readFileSync(pictureRequest)
      }]
    },
    function(error, response, body) {
      if (error) {
        callback((new Date()).toLocaleString() + " ==> [ERROR postPicture] ==> " + error);
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