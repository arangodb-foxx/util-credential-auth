/*global require, exports, applicationContext, Buffer */
'use strict';
var crypto = require('org/arangodb/crypto');
var cfg = applicationContext.configuration;
var baseline = 1000;

function verifyPassword(authData, password) {
  if (!authData) {
    authData = {};
  }
  if (typeof authData === 'string') {
    authData = JSON.parse(authData);
  }
  if (authData.hashMethod && authData.hashMethod !== 'pbkdf2') {
    throw new Error('Unsupported hash method: ' + authData.hashMethod);
  }

  var workUnits = authData.workUnits || cfg.workUnits || 60;
  var workKey = cfg.workKey || 388;

  // non-lazy comparison to avoid timing attacks
  return crypto.constantEquals(
    authData.hash || '', new Buffer(crypto.pbkdf2(
    authData.salt || '',
    password || '',
    (baseline + workKey) * workUnits,
    authData.keyLength || cfg.keyLength || 66
  ), 'hex').toString('base64'));
}

function hashPassword(password) {
  var salt = crypto.genRandomAlphaNumbers(cfg.keyLength || 66);
  var baseline = 1000;
  var keyLength = cfg.keyLength || 66;
  var workUnits = cfg.workUnits || 60;
  var workKey = cfg.workKey || 388;
  var iterations = (baseline + workKey) * workUnits;
  var data = {
    hash: new Buffer(crypto.pbkdf2(
      salt, password, iterations, keyLength
    ), 'hex').toString('base64'),
    salt: salt,
    keyLength: keyLength,
    hashMethod: 'pbkdf2',
    workUnits: workUnits
  };

  return cfg.json ? JSON.stringify(data) : data;
}

exports.verifyPassword = verifyPassword;
exports.hashPassword = hashPassword;