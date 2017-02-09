import autobind from 'core-decorators/lib/autobind';
import parse from 'url-parse';
import auth0 from 'auth0-js';
import generateRandomChallengePair from './generateRandomChallengePair';

/**
 * Helper Class to implement PKCE in Auth0.js environments
 */
@autobind
class PKCEAuth {
    constructor(domain, clientID, redirectUri) {
        if (!domain) {
            throw new Error('You must provide an auth0 domain as the first parameter');
        }
        if (!clientID) {
            throw new Error('You must provide a clientID');
        }
        if (!redirectUri) {
            throw new Error('You must provide a clientID, which is used for building the AuthorizeURL and Exchange code for token');
        }
        this.keys = generateRandomChallengePair();
        this.redirectUri = redirectUri;
        this.client = new auth0.Authentication({
            domain,
            clientID
        });
    }


    handleCallback(responseUrl, cb) {
        if (!responseUrl || typeof responseUrl !== 'string') {
            return cb(new Error('responseUrl must be a string'));
        }

        if (!cb || typeof cb !== 'function') {
            return cb(new Error('cb must be a function which will be called back after exchanging code for tokens on the server'));
        }

        const response = parse(responseUrl, true).query;
        
        if (response.error) {
            return cb(new Error(response.error_description || response.error));
        }

        const {client, keys, redirectUri } = this;
        const code = response.code;
        const verifier = keys.codeVerifier;
        client.oauthToken({
            code_verifier: keys.codeVerifier,
            grantType: 'authorization_code',
            redirectUri: redirectUri,
            code
        }, cb);
    }

    buildAuthorizeUrl(params) {
        const {redirectUri, keys} = this;
        const {codeChallenge} = keys;

        params = Object.assign({}, params, {
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            redirectUri: redirectUri,
            responseType: 'code',
        });

        return this.client.buildAuthorizeUrl(params);
    }
}

export default PKCEAuth;
