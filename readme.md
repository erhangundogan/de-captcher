# de-captcher.com node.js library

de-captcher.com basically resolves captcha requests.
You need an account from de-captcher.com to use this library.

### Quickstart
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

### Functions

* getBalance

* postPicture

* reportBadResult

* getSystemLoad

* setTimeouts

* setPictureProcess

* setMultiPictureProcess