/* Chrome handles this flow very maturely, we do not need to do anything special */
import BaseAdapter from './BaseAdapter';

class ElectronProtocolHandler extends BaseAdapter{
    async getResponseURL (authenticationUrl) {
        /* This will avoid cordova from crashing */
        const {shell} = require('electron');
        shell.openExternal(authenticationUrl);
        const [responseUrl] = await this.awaitCallback();
        return responseUrl;
    }

    getPlatformName(){
        return 'electron';
    }
}

export default ElectronProtocolHandler;