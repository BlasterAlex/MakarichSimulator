$(document).ready(function () {

  // Получение текущего режима состояния
  chrome.storage.sync.get(['autoMode'], function (result) {
    var autoMode = result.autoMode;
    $("#cbx").prop("checked", autoMode);
  })

  // Изменение состояния
  $('#cbx').click(function () {
    chrome.storage.sync.set({
      autoMode: this.checked
    });
    if (this.checked === true) {
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
    chrome.storage.sync.get(['autoMode'], function (result) {
      console.log('Mode currently is ' + result.autoMode);
    })
  });
})