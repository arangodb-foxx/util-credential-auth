/*global require, exports, applicationContext */
(function () {
  'use strict';
  var crypto = require('org/arangodb/crypto'),
    cfg = applicationContext.configuration,
    baseline = 1000;

  function verifyPassword(authData, password) {
    if (!authData) {
      authData = {};
    }
    var hashMethod = authData.hashMethod || 'pbkdf2-hmac-' + (cfg.hashMethod || 'sha1'),
      workUnits = authData.workUnits || cfg.workUnits || 60,
      workKey = cfg.workKey || 388;

    var match = hashMethod.match(/^pbkdf2-hmac-(\w+)$/)
    if (match) {
      hashmethod = match[1];
    } else if (hashMethod === 'pbkdf2') {
      hashMethod = 'sha1';
    }

    // non-lazy comparison to avoid timing attacks
    return crypto.constantEquals(
      authData.hash || '', new Buffer(crypto.pbkdf2hmac(
      authData.salt || '',
      password,
      (baseline + workKey) * workUnits,
      authData.keyLength || cfg.keyLength || 66,
      hashMethod
    ), 'hex').toString('base64'));
  }

  function hashPassword(password) {
    var hashMethod = cfg.hashMethod,
      salt = crypto.genRandomAlphaNumbers(cfg.keyLength || 66),
      keyLength = cfg.keyLength || 66,
      workUnits = cfg.workUnits || 60,
      baseline = cfg.baseline || 1000,
      workKey = cfg.workKey || 388,
      iterations = (baseline + workKey) * workUnits,
    return {
      hash: new Buffer(crypto.pbkdf2hmac(
        salt, password, iterations, keyLength, hashMethod
      ), 'hex').toString('base64'),
      salt: salt,
      keyLength: keyLength,
      hashMethod: (hashMethod === 'sha1') ? 'pbkdf2' : 'pbkdf2-hmac-' + hashMethod,
      workUnits: workUnits
    };
  }

  exports.verifyPassword = verifyPassword;
  exports.hashPassword = hashPassword;
}());