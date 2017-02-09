import autobind from 'core-decorators/lib/autobind';

@autobind
class BrowserTabAdapter {
    constructor (uiOptions) {
        // You can optionally use this to customize the look and feel.
    }

    static isAvailable () {
        return new Promise((resolve, reject) => {
            SafariViewController.isAvailable(resolve, reject)
        });
    }

    // Opens the url
    open(url) {
        const sharedView = window.SafariViewController;
        const options = {url, hidden: false};

        return new Promise((resolve, reject) => {
            sharedView.show(options, (result) => {
                if (result.event === 'loaded') {
                    if (!this.hasFinished) {
                        return resolve({});
                    }
                    reject(new Error('There was an error processing the login, loaded called after the authentication was complete'));
                }
            }, reject);
        });
    }

    close (){
        this.hasFinished = true;
        SafariViewController.hide();
    }
}

export default BrowserTabAdapter;