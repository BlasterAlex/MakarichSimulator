/*
 * (c) 2019 BlasterAlex
 * MIT License
 */

// Отображение дополнительного чекбокса 
function changeKeepCheckbox(state) {
  if (state) {
    $("#keepParent").slideDown({ duration: 150 });
  } else {
    if ($("#keepParent").is(':visible'))
      $("#keepParent").slideUp({ duration: 150 });
  }
}

$(document).ready(function () {
  // Скрыть дополнительный чекбокс
  $("#keepParent").hide();

  // Получение текущих режимов состояний
  chrome.storage.sync.get(['autoMode'], function (result) {
    $("#auto").prop("checked", result.autoMode);
    changeKeepCheckbox(result.autoMode);
  });
  chrome.storage.sync.get(['rememberFirst'], function (result) {
    $("#keep").prop("checked", result.rememberFirst);
  });
  chrome.storage.sync.get(['showMode'], function (result) {
    $("#hide").prop("checked", result.showMode);
  });
  chrome.storage.sync.get(['recoveryMode'], function (result) {
    $("#restore").prop("checked", result.recoveryMode);
  });

  // Изменение состояния autoMode
  $('#auto').click(function () {
    chrome.storage.sync.set({
      autoMode: this.checked
    });
    // Отображение дополнительного чекбокса
    changeKeepCheckbox(this.checked);
    // Отправка запроса на изменение иконки расширения
    var port = chrome.extension.connect({
      name: "Backend Communication"
    });
    port.postMessage("Check URL");
  });

  // Изменение состояния rememberFirst
  $('#keep').click(function () {
    chrome.storage.sync.set({
      rememberFirst: this.checked
    });
    chrome.storage.sync.remove(['keepedFile'], function () { });
  });

  // Изменение состояния showMode
  $('#hide').click(function () {
    chrome.storage.sync.set({
      showMode: this.checked
    });
  });

  // Изменение состояния recoveryMode
  $('#restore').click(function () {
    chrome.storage.sync.set({
      recoveryMode: this.checked
    });
    chrome.storage.sync.remove(['recoveryFile'], function () { });
  });
})