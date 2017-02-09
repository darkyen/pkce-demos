import 'babel-polyfill';
import HybridOAuthClient from './HybridOAuthClient';
import App from './App';

// In a real world app, you should replace this with React
// or Angular or jQuery.


function main() {
    const app = new App();
    function intentHandler(url) {
        HybridOAuthClient.resumeAuth(url);
    }
    window.handleOpenURL = intentHandler;
    app.run('#app');
}

document.addEventListener('deviceready', main);
