# Auth0 Cordova Sample 01-Login

## Overview
This is a simple sample that demonstrates how to use Auth0 in Hybrid Apps.PKCE Auth Client for Auth0.JS. Which in turn uses the SFSafariViewController plugin.

To handle the callback we use customurischeme plugin to listen to a custom uri which is defined by your package id and will be generted for you.

### Getting Started

Please clone and configure the `env.example.js` into `env.js`. Then run the following commands to build the javascript 
project, prepare the cordova plugins and finally launch it on ios simulator.

```bash
npm install
npm run build
npm run prepare
npm run ios or npm run android
```

## Development

Run the watcher to constantly build the application and pipe it to `/www` folder.

```bash
npm run watch
```

The javascript project is built from '/src/index.js' to '/www/index.js`.

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free Auth0 account

1. Go to [Auth0](https://auth0.com/signup) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.
