import env from '../env';
import Auth0 from 'auth0-js';
import decodeJwt from 'jwt-decode';
import Session from './Session';
import PKCEAuth from './PKCEAuth';
import autobind from 'core-decorators/lib/autobind';

import Cordova from './adapters/Cordova';
import Chrome from './adapters/Chrome.Identity';
import Electron from './adapters/Electron';

const $$ = (arg) => document.querySelectorAll(arg);
const $ = (arg) => document.querySelector(arg);
const $i = (id) => document.getElementById(id);
const $c = (className) => document.getElementsByClassName(className);

/*
 * 
 * App class is an example application which aims to 
 * be a simple and framework agnostic app, written purely
 * in javascript. This should translate to most modern
 * frameworks 
 * 
 */

@autobind
class App {
    constructor() {
        this.auth0 = new Auth0.Authentication({
            domain: env.domain,
            clientID: env.clientID
        });
        this.state = {
            authenticated: false,
            accessToken: false,
            currentRoute: '/',
            routes: {
                '/': {
                    id: 'loading',
                    onMount: (page) => {
                        if (this.state.authenticated)
                            return this.redirectTo('/home');
                        return this.redirectTo('/login');
                    }
                },
                '/login': {
                    id: 'login',
                    onMount: (page) => {
                        if (this.state.authenticated === true) {
                            return this.redirectTo('/home');
                        }
                        const loginButton = page.querySelector('.btn-login');
                        loginButton.addEventListener('click', e => this.login(e));
                    }
                },
                '/home': {
                    id: 'profile',
                    onMount: (page) => {
                        if (this.state.authenticated === false) {
                            return this.redirectTo('/login');
                        }
                        const logoutButton = page.querySelector('.btn-logout');
                        const profileCodeContainer = page.querySelector('.profile-json')
                        logoutButton.addEventListener('click', e => this.logout(e));
                        this.loadProfile().then((profile) => {
                            profileCodeContainer.textContent = JSON.stringify(profile, null, 4);
                        });
                    }
                }
            }
        };
    }

    run(id) {
        // The first run parts
        this.container = $(id);
        this.resumeApp();
    }

    loadProfile() {
        return new Promise((resolve, reject) => {
            this.auth0.userInfo(this.state.accessToken, (err, profile) => {
                if (err) reject(err);
                resolve(profile);
            });
        });
    }

    getApplicableAdapter () {
        /* @TODO: Make this env specific so app size doesn't bloat*/
        if(window.electron){
            return Electron;
        }
        if(window.cordova){
            return Cordova;
        }
        if(window.chrome.runtime){
            return Chrome;
        }
    }

    login(e) {
        if (e.target) {
            e.target.disabled = true;
        }

        if(window.chrome && Chrome.getContext() !== 'background'){
            /* Send message and return, the background script will execute just this */
            return chrome.runtime.sendMessage({
                type: "authenticate"
            });
        }

        const Adapter = this.getApplicableAdapter();
        const adapter = new Adapter(env.domain, env.packageIdentifier);
        const pkceAuth = new PKCEAuth(env.domain, env.clientID, adapter.getRedirectURL());

        const options = {
            scope: 'openid profile',
            audience: env.audience
        };

        const url = pkceAuth.buildAuthorizeUrl(options);

        return adapter.getResponseURL(url)
            .then((redirectUrl) => new Promise((resolve, reject) => {
                const callback = (err, authResult) => err ? reject(err) : resolve(authResult);
                pkceAuth.handleCallback(redirectUrl, callback);
            }))
            .then((authResult) => {
                localStorage.setItem('access_token', authResult.accessToken);
                if(window.chrome && Chrome.getContext() === 'background'){
                    return; 
                }
                this.resumeApp();
            });
    }

    logout(e) {
        localStorage.removeItem('access_token');
        this.resumeApp();
    }

    redirectTo(route) {
        if (!this.state.routes[route]) {
            throw new Error(`Unknown route "${route}".`);
        }
        this.state.currentRoute = route;
        this.render();
    }

    resumeApp() {
        const accessToken = localStorage.getItem('access_token');

        if (accessToken) {
            const payload = decodeJwt(accessToken);
            if (payload.exp > Date.now() / 1000) {
                this.state.authenticated = true;
                this.state.accessToken = accessToken;
            }
        } else {
            this.state.authenticated = false;
            this.state.accessToken = '';
        }

        this.render();
    }

    resumeAuth (...args) {
        /* This is to avoid cordova from crashing on iOS */
        setTimeout(function(){
            Session.handleCallback(...args);
        }, 4);
    }

    render() {
        const currRoute = this.state.routes[this.state.currentRoute];
        const currRouteEl = $i(currRoute.id);
        const element = document.importNode(currRouteEl.content, true);
        this.container.innerHTML = '';
        this.container.appendChild(element);
        currRoute.onMount(this.container);
    }
}

export default App;