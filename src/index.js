import 'babel-polyfill';
import App from './App';
import Chrome from './adapters/Chrome.Identity';

// In a real world app, you should replace this with React
// or Angular or jQuery.


function main() {
    const app = new App();

    /* @TODO: handle these in the build process */
    
    if (window.cordova || window.electron) {
        window.handleOpenURL = app.resumeAuth;
    }

    /* Quick and dirty access check for chrome */
    if(window.chrome && Chrome.getContext() === 'background') {
        chrome.runtime.onMessage.addListener(function (event) {
            if(event.type === 'authenticate'){
                app.login(event).then(() => {
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icons/icon128.png',
                        title: 'Login Successful',
                        message: 'You can use the app now'
                    });
                }, (err) => {
                    chrome.notifications.create({
                        type: 'basic',
                        title: 'Login Failed',
                        message: err.message,
                        iconUrl: 'icons/icon128.png'
                    });
                });
            }
        });
    }else{
        app.run('#app');
    }

    /* Nothing special needed for Chrome \o/ */
}

if(window.cordova){
    document.addEventListener('deviceready', main);
}else{
    main();
}
