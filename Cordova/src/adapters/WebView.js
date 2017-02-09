import autobind from 'core-decorators/lib/autobind';

// Fallback to old WebView where SFSafariViewController is not supported
@autobind
class WebViewAdapter{  
  open(url){
    const browser = cordova.InAppBrowser;  
    return new Promise((resolve, reject) => {
      const tab = browser.open(url, '_blank');

      const handleFirstLoadEnd = ({url}) => {
        tab.removeEventListener('loadstop', handleFirstLoadEnd);        
        clearEvents();
        resolve({});
      }
      
      const handleLoadError = (e) => {
        clearEvents();
        reject(e);
      }
      
      const clearEvents = (e) => {
        tab.removeEventListener('loaderror', handleLoadError);
        tab.removeEventListener('loadstop', handleFirstLoadEnd);
      }
      
      tab.addEventListener('loadstop', handleFirstLoadEnd);
      tab.addEventListener('loaderror', handleLoadError);
      this.tab = tab;
    });
  }


  close(){
    this.hasFinished = true;
    this.tab.close();
    this.tab = null;
  }

}

export default WebViewAdapter;