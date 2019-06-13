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
  });
  chrome.storage.sync.get(['recoveryMode'], function (result) {
    $("#cbz").prop("checked", result.recoveryMode);
  });

  // Изменение состояния autoMode
  $('#cbx').click(function () {
    chrome.storage.sync.set({
      autoMode: this.checked
    });
    // Отправка запроса на изменение иконки расширения
    var port = chrome.extension.connect({
      name: "Backend Communication"
    });
    port.postMessage("Check URL");
  });

  // Изменение состояния showMode
  $('#cby').click(function () {
    chrome.storage.sync.set({
      showMode: this.checked
    });
  });

  // Изменение состояния recoveryMode
  $('#cbz').click(function () {
    chrome.storage.sync.set({
      recoveryMode: this.checked
    });
    chrome.storage.sync.remove(['recoveryFile'], function () { });
  });
})