# de-captcher.com nodejs library

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

    // send image address or file system image
    // http://www.google.com/recaptcha/learnmore ==> $("#recaptcha_image > img").attr(src);
    decaptcher.postPicture(address, function(err, result) {
      console.log(result);
    });

## Install

    git clone https://github.com/erhangundogan/de-captcher.git
    npm install

OR

    npm install -d de-captcher


## Functions

* getBalance(callback) : Get your current balance status

* postPicture(<url or fs>, callback): send picture for process

* reportBadResult(majorID, minorID, callback): send bad picture process report

* getSystemLoad(callback): get de-captcher system load

* setTimeouts(value): captcha resolve timeouts

* setPictureProcess(value): captcha picture process type

* setMultiPictureProcess(value): multiple picture process type


## License

Copyright 2013 Erhan Gundogan

Licensed under the MIT License.