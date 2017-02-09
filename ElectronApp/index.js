const {BrowserWindow, app, protocol, ipcMain} = require('electron');
const env = require('../env');

var mainWindow = null;
function _generateResponse () {
    return `
        <html>
            <head></head>
            <body>
                <h1>Authentication Complete</h1>
                <p>You can close this page now</p>
            </body>
        </html>
    `;
}
    
app.on('ready', function() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800
    });
    mainWindow.loadURL('file://' + __dirname + '/app/index.html');
    mainWindow.webContents.openDevTools();
    app.makeSingleInstance(function(){
        console.log(err || 'App is running in single instance');
    })

    console.log(env.packageIdentifier);

    app.setAsDefaultProtocolClient(env.packageIdentifier);
    app.on('open-url', function(event, url){
        console.log("Open url called with", url);
        mainWindow.webContents.executeJavaScript(`
            window.handleOpenURL('${url}');
        `);
    });
});