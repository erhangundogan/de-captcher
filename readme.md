# de-captcher.com nodejs library

de-captcher.com basically resolves captcha requests.
You need an account from de-captcher.com to use this library.

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

OR

    npm install de-captcher


## Functions

* getBalance

* postPicture

* reportBadResult

* getSystemLoad

* setTimeouts

* setPictureProcess

* setMultiPictureProcess


## License

Copyright 2013 Erhan Gundogan

Licensed under the MIT License.