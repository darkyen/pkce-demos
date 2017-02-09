import autobind from 'core-decorators/lib/autobind';
import Session from '../Session';

@autobind
class BaseAdapter{    
    constructor(domain, packageIdentifier){
        this.domain = domain;
        this.packageIdentifier = packageIdentifier;
    }

    getPlatformName(){
        throw new Error('Each adapter must implement this');
    }

    awaitCallback(){
        return new Promise(
            (resolve, reject) => Session.queueForCallback(resolve, reject, this)
        );
    }

    canHandle(url) {
        const cbUrl = this.getRedirectURL();
        return url.indexOf(cbUrl) !== -1;
    }

    getRedirectURL(){
        return `${this.packageIdentifier}://${this.domain}/${this.getPlatformName()}/${this.packageIdentifier}/callback`;
    }
}

export default BaseAdapter;