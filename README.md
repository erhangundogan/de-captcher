# de-captcher.com nodejs library

[![Build Status](https://travis-ci.org/erhangundogan/de-captcher.png?branch=master)](https://travis-ci.org/erhangundogan/de-captcher)

http://de-captcher.com basically resolves captcha requests.
You need an account for authentication so that you can use this library.

## Quickstart
Require library, Create object with your username/password and call functions

    var Decaptcher = require("de-captcher").decaptcher;
    var decaptcher = new Decaptcher("username", "password");

    // get your balance
    decaptcher.getBalance(function(err, balance) {
      console.log(balance);
    });

    // send file system image
    decaptcher.postPicture(path.join(__dirname, "captcha.jpg"), function(err, result) {
      console.log(result);
    });

    // send http address with mime type
    decaptcher.postPicture("http://www.example.org/recaptcha.ashx", "image/jpeg", function(err, result) {
      console.log(result);
    });

## Install

    npm install -d de-captcher


## Functions

* getBalance(callback) : Get your current balance status

* postPicture(url/fs, mimeType, callback): send picture for process. mimeType parameter is not mandatory

* reportBadResult(majorID, minorID, callback): send bad picture process report

* getSystemLoad(callback): get de-captcher system load

* setTimeouts(value): captcha resolve timeouts

* setPictureProcess(value): captcha picture process type

* setMultiPictureProcess(value): multiple picture process type


## License

Copyright 2013 Erhan Gundogan

Licensed under the MIT License.