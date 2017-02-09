import BaseAdapter from './BaseAdapter';
/* Chrome handles this flow very maturely, we do not need to do anything special */

class ChromeIdentityAdapter extends BaseAdapter{
    getResponseURL (authenticationUrl) {
        return new Promise(function(resolve, reject){
            return chrome.identity.launchWebAuthFlow({
                url: authenticationUrl,
                interactive: true
            }, function (responseURL) {
                if(chrome.runtime.lastError){
                    return reject(chrome.runtime.lastError)
                }
                resolve(responseURL);
            });
        });
    }

    static getContext () {
        var loc = window.location.href;
        if(/^chrome/.test(loc)){
            if(window == chrome.extension.getBackgroundPage()){
                return 'background';
            }else{
                return 'extension';
            }
        }else if( /^https?/.test(loc) ){
            return 'content';
        }
    }

    getPlatformName () {
        return 'chrome';
    }

    getRedirectURL(){
        return chrome.identity.getRedirectURL(`${this.domain}/${this.getPlatformName()}/${this.packageIdentifier}/callback`);
    }

}

export default ChromeIdentityAdapter;