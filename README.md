# The Credential Authentication App

The credential auth app provides hashed password-based authentication with automatically generated salts and constant-time password verification that is compatible with [Eric Elliott's `credential` module](https://npmjs.org/package/credential).

## Configuration

This app has the following configuration options:

* *workKey*: secret value between one and 999 required to verify generated passwords. Default: *388*.
* *workUnits* (optional): multiplication factor to determine the number of PBKDF2 iterations. Higher values increase the cost of generating hashes, making them harder to brute-force. Default: *60*.
* *hashMethod* (optional): digest algorithm to use with PBKDF2-HMAC. Supported values: *sha1*, *sha224*, *sha256*, *sha384*, *sha512*, *md5*. Default: *"sha1"*.
* *keyLength* (optional): length of PBKDF2 derived keys. Default: *66*.

## JavaScript API: *auth*

This app exposes its functionality via a JavaScript API named *auth*.

*Examples*

```js
var auth = Foxx.requireApp('/credential-auth').auth;
```

### Generate an authentication object

Generates an authentication object for a given password.

`auth.hashPassword(password)`

Returns an authentication object with the following properties:

* *hash*: the generated base64-encoded hash.
* *salt*: the salt used to generate the hash.
* *keyLength*: see [Configuration](#configuration).
* *hashMethod*: the hash algorithm used to generate the hash, e.g. *"pbkdf2-hmac-sha256"*.
* *workUnits*: see [Configuration](#configuration).

*Parameter*

* *password*: the password to hash.

### Verify a password

Verifies a password against a given authentication object.

`auth.verifyPassword(authData, password)`

Generates a hash for the given password using the properties stored in the authentication object and performs a constant time string comparison on them. Returns *true* if the password is valid or *false* otherwise.

*Parameter*

* *authData*: an authentication object.
* *password*: a password to verify.
