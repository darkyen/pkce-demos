import autobind from 'core-decorators/lib/autobind';

@autobind
class Session {
    static shared = null;
    
    static queueForCallback(resolve, reject, client) {
        if (Session.shared) {
            Session.shared.stop(new Error('Only one instance of auth can happen at a time'));
        }
        Session.shared = new Session(resolve, reject, client);
    }

    static handleCallback (url) {
        if (Session.shared) {
            Session.shared.resume(url);
        }
    }

    constructor(resolve, reject, client) {
        this.reject = reject;
        this.client = client;
        this.resolve = resolve;
    }

    stop(reason) {
        this.reject(reason);
    }

    resume(url) {
        if (this.client.canHandleUrl(url)) {
            this.resolve(url);
            Session.shared = null;
        }
    }
}

export default Session;