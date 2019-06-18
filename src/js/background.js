/*
 * (c) 2019 BlasterAlex
 * MIT License
 */

// Инициализация переменных состояний
chrome.storage.sync.get(['autoMode'], function (result) {
  if (result.autoMode === undefined) {
    chrome.storage.sync.set({
      autoMode: false
    });
  }
});
chrome.storage.sync.get(['rememberFirst'], function (result) {
  if (result.rememberFirst === undefined) {
    chrome.storage.sync.set({
      rememberFirst: false
    });
  }
});
chrome.storage.sync.get(['showMode'], function (result) {
  if (result.showMode === undefined) {
    chrome.storage.sync.set({
      showMode: true
    });
  }
});
chrome.storage.sync.get(['recoveryMode'], function (result) {
  if (result.recoveryMode === undefined) {
    chrome.storage.sync.set({
      recoveryMode: false
    });
  }
});
// Освобождение памяти
chrome.storage.sync.remove(['recoveryFile'], function () { });
chrome.storage.sync.remove(['keepedFile'], function () { });

// Изменение значка при запуске скрипта
function checkUrl() {
  chrome.tabs.getSelected(null, function (activeTab) {
    if (activeTab.url.match("http://edu.tltsu.ru/md/trial.php*")) {
      chrome.storage.sync.get(['autoMode'], function (result) {
        var autoMode = result.autoMode;
        if (autoMode === true) {
          chrome.browserAction.setIcon({
            path: {
              "16": "data/images/icons/active-icon-auto-16.png",
              "32": "data/images/icons/active-icon-auto-32.png"
            }
          });
        } else {
          chrome.browserAction.setIcon({
            path: {
              "16": "data/images/icons/active-icon-16.png",
              "32": "data/images/icons/active-icon-32.png"
            }
          });
        }
      });
    } else {
      chrome.browserAction.setIcon({
        path: {
          "16": "data/images/icons/inactive-icon-16.png",
          "32": "data/images/icons/inactive-icon-32.png"
        }
      });
    }
  });
};
checkUrl();

// Изменение иконки расширения при изменении вкладки
chrome.tabs.onActivated.addListener(function () {
  checkUrl();
});

// Изменение иконки расширения при обновлении url
chrome.tabs.onUpdated.addListener(function () {
  checkUrl();
});

// Изменение иконки расширения по запросу от popup
chrome.extension.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (msg === "Check URL")
      checkUrl();
  });
});
