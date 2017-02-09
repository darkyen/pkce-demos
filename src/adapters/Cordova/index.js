import autobind from 'core-decorators/lib/autobind';
import BaseAdapter from '../BaseAdapter';
import BrowserTab from './BrowserTab';
import WebView from './WebView';

@autobind class CordovaAdapter extends BaseAdapter{
    async getResponseURL(authorizationUrl) {
        const isBrowserTabAvailable = await CordovaAdapter.isBrowserTabAvailable();
        const browser = isBrowserTabAvailable?new BrowserTab(): new WebView();

        await browser.open(authorizationUrl);
        const [responseUrl] = await this.awaitCallback();
        browser.close();
        return responseUrl;
    }

    static isBrowserTabAvailable () {
        return new Promise((resolve, reject) => {
            try{
                SafariViewController.isAvailable(resolve, reject)
            }catch(e){
                reject(false);
            }
        });
    }

    getPlatformName () {
        const userAgent = navigator.userAgent;
        if (/android/i.test(userAgent)) {
            return "android";
        }

        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "ios";
        }
    }
}

export default CordovaAdapter;