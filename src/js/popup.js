/*
 * (c) 2019 BlasterAlex
 * MIT License
 */

$(document).ready(function () {

  // Получение текущих режимов состояний
  chrome.storage.sync.get(['autoMode'], function (result) {
    $("#cbx").prop("checked", result.autoMode);
  });

  chrome.storage.sync.get(['showMode'], function (result) {
    $("#cby").prop("checked", result.showMode);
  })

  // Изменение состояния autoMode
  $('#cbx').click(function () {
    chrome.storage.sync.set({
      autoMode: this.checked
    });
    if (this.checked === true) {
      chrome.browserAction.setIcon({
        path: {
          "16": "/data/images/icons/active-icon-auto-16.png",
          "32": "/data/images/icons/active-icon-auto-32.png"
        }
      });
    } else {
      chrome.browserAction.setIcon({
        path: {
          "16": "/data/images/icons/active-icon-16.png",
          "32": "/data/images/icons/active-icon-32.png"
        }
      });
    }
    chrome.storage.sync.get(['autoMode'], function (result) {
      console.log('autoMode currently is ' + result.autoMode);
    })
  });

  // Изменение состояния showMode
  $('#cby').click(function () {
    chrome.storage.sync.set({
      showMode: this.checked
    });
    chrome.storage.sync.get(['showMode'], function (result) {
      console.log('showMode currently is ' + result.showMode);
    })
  });
})