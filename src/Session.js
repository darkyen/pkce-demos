import autobind from 'core-decorators/lib/autobind';

@autobind
class Session {
    static shared = null;
    static packageIdentifier = null;

    static queueForCallback(resolve, reject, adapter) {
        if (Session.shared) {
            Session.shared.stop(new Error('Only one instance of auth can happen at a time'));
        }
        Session.shared = new Session(resolve, reject, adapter);
    }

    static handleCallback (...args) {
        if (Session.shared) {
            Session.shared.resume(...args);
        }
    }

    constructor(resolve, reject, adapter) {
        this.reject = reject;
        this.resolve = resolve;
        this.adapter = adapter;
    }

    stop(reason) {
        this.reject(reason);
    }

    resume(...args) {
        if (this.adapter.canHandle(...args)) {
            this.resolve(args);
            Session.shared = null;
        }
    }
}

export default Session;