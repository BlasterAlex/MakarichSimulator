// Инициализация переменной состояния
chrome.storage.sync.get(['autoMode'], function (result) {
  if (result.autoMode === undefined) {
    chrome.storage.sync.set({
      autoMode: false
    });
  }
});
// Изменение иконки расширения при изменении вкладки
chrome.tabs.onActivated.addListener(function (activeTab) {
  chrome.tabs.getSelected(null, function (activeTab) {
    if (activeTab.url.match("http://edu.tltsu.ru/md/trial.php*")) {
      chrome.storage.sync.get(['autoMode'], function (result) {
        var autoMode = result.autoMode;
        if (autoMode === true) {
          chrome.browserAction.setIcon({
            path: {
              "16": "/data/icons/active-icon-auto-16.png",
              "32": "/data/icons/active-icon-auto-32.png"
            }
          });
        } else {
          chrome.browserAction.setIcon({
            path: {
              "16": "/data/icons/active-icon-16.png",
              "32": "/data/icons/active-icon-32.png"
            }
          });
        }
      });
    } else {
      chrome.browserAction.setIcon({
        path: {
          "16": "/data/icons/inactive-icon-16.png",
          "32": "/data/icons/inactive-icon-32.png"
        }
      });
    }
  });
});