/*
 * (c) 2019 BlasterAlex
 * MIT License
 */

// Получение данных из chrome.storage
function getData(callback) {
  let data = new Object();
  chrome.storage.sync.get(['autoMode'], function (result) {
    data.autoMode = result.autoMode;
    chrome.storage.sync.get(['rememberFirst'], function (result) {
      data.rememberFirst = result.rememberFirst;
      chrome.storage.sync.get(['showMode'], function (result) {
        data.showMode = result.showMode;
        chrome.storage.sync.get(['recoveryMode'], function (result) {
          data.recoveryMode = result.recoveryMode;
          chrome.storage.sync.get(['recoveryFile'], function (result) {
            data.recoveryFile = result.recoveryFile;
            chrome.storage.sync.get(['keepedFile'], function (result) {
              data.keepedFile = result.keepedFile;
              callback(data);
            });
          });
        });
      });
    });
  });
}

// Скачивание html файла
function downloadFile(element, filename = '') {
  let html = `<body>
  ${element.innerHTML}
</body>`;

  let file = new Blob(['\ufeff', html], {
    type: 'text/html'
  });

  // Specify link url
  let url = URL.createObjectURL(file);
  // Specify file name
  filename = filename ? filename + '.html' : 'content.html';
  // Create download link element
  let downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Create a link to the file
    downloadLink.href = url;
    // Setting the file name
    downloadLink.download = filename;
    //triggering the function
    downloadLink.click();
  }
  document.body.removeChild(downloadLink);
}

// Загрузка локального файла
function readFile(file, onLoadCallback) {
  let reader = new FileReader();
  reader.onload = onLoadCallback;
  reader.readAsText(file);
}

// Объединение текста, если он разбит на несколько <p></p>
function pUnion(from, to) {
  let i = 0, p = $(from).find('p')[++i];
  while ($(p).text().length > 0) {
    $(to).append($(p));
    p = $(from).find('p')[++i];
  }
}

// Полный url к картинкам
function fullURL(element) {
  $(element).find('img').each(function () {
    let src = $(this).attr('src');
    $(this).attr('src', "http://edu.tltsu.ru" + src);
  });
}

// Проверка текущего вопроса
function isDefined(quest, answ) {
  if (quest === undefined) {
    alert("Вопрос непонятен!");
    return false;
  } else if (answ === undefined) {
    alert("Ответ непонятен!");
    return false;
  }
  return true;
}

// Сообщение в цветном блоке
function notification(parent, info) {
  let message = document.createElement("SPAN");
  let msg_text = document.createTextNode(info.text);
  message.appendChild(msg_text);
  message.setAttribute("style", "border-radius: 10px; background: " + info.color + "; padding: 10px;");
  parent.prepend(message);
}

// Главная функция
(function (window, undefined) {
  // Нормализация window
  var w;
  if (typeof unsafeWindow != undefined) {
    w = unsafeWindow
  } else {
    w = window;
  }

  // Не запускать скрипт во фреймах
  // без этого условия скрипт будет запускаться несколько раз на странице с фреймами
  if (w.self != w.top) {
    return;
  }

  // Получение данных из chrome.storage
  getData(function (data) {
    // Получение правильного ответа
    var answ = $('p:contains("Правильный ответ:")')[1];
    // Eсли пользователь залогинился
    if (answ != undefined) {
      // Объединение ответа в один тег
      pUnion($(answ).closest("td"), answ);
      // Скрыть ответ 
      if (data.showMode === true)
        answ.style.display = "none";
      // Полный url к картинкам
      fullURL(answ);

      // Получение вопроса
      let questTR = $($(answ).closest("tbody")).find('tr')[2];
      if ($(questTR).find('p')[0] === undefined)
        questTR = $($(answ).closest("tbody")).find('tr')[3];
      let quest = $(questTR).find('p')[0];
      // Объединение вопроса в один тег
      pUnion(questTR, quest);
      // Полный url к картинкам
      fullURL(quest);

      // Стили для кнопок на сайте
      let css =
        'button{ min-width: 100px; min-height: 30px; margin-bottom: 10px }\n' +
        'button:hover{ opacity: 0.9; cursor: pointer }';
      let style = document.createElement('style');
      if (style.styleSheet)
        style.styleSheet.cssText = css;
      else
        style.appendChild(document.createTextNode(css));
      document.getElementsByTagName('head')[0].appendChild(style);

      // Ручной режим
      if (data.autoMode === false) {
        // Кнопка сохранения в файл
        var button = document.createElement("BUTTON");
        let t = document.createTextNode("Save it");
        button.appendChild(t);
        button.setAttribute("id", "saveIt");
        button.setAttribute("type", "button");
        button.setAttribute("style", "background-color: rgb(169, 245, 171)");
        document.getElementsByName("gocomplete")[0].replaceWith(button);

        // Сохранение результатов
        $('#saveIt').click(function () {
          if (isDefined(quest, answ)) {
            // Отображение ответа
            answ.style.display = "block";

            // Создание блока с полученной информацией
            let x = document.createElement("DIV");
            x.appendChild(quest.cloneNode(true));
            x.appendChild(answ.cloneNode(true));
            document.body.appendChild(x);

            // Загрузка html файла 
            downloadFile(x, 'content');
            document.body.removeChild(x);

            // Переход к следующему
            document.getElementsByName("gonext")[0].click();
          }
        });
      } else { // автоматический режим
        // Кнопка остановки процесса
        var button = document.createElement("BUTTON");
        let t = document.createTextNode("Stop it");
        button.appendChild(t);
        button.setAttribute("id", "stopIt");
        button.setAttribute("type", "button");
        button.setAttribute("style", "background-color: pink");
        document.getElementsByName("gocomplete")[0].replaceWith(button);

        // Остановить процесс
        $('#stopIt').click(function () {
          clearTimeout(Timer);
        });

        // Режим сохранения первого вопроса
        if (data.rememberFirst === true) {
          // Если это первый вопрос в серии
          if (data.keepedFile === undefined) {
            if (confirm("Сейчас мы начнем закидывать вас файликами с вопросами.\n" +
              "Вы готовы к такому повороту событий?")) { // пользователь нажал 'Ok'
              // Таймер для ожидания нажатия кнопки остановки 
              // Сообщение пользователю о начале прохода
              notification($(answ).closest("td"), {
                text: "Обратный отсчет...2...1",
                color: "rgb(196, 240, 192)"
              });
              var Timer = setTimeout(function () {
                // Если кнопка не нажата => сохранение результатов
                if (isDefined(quest, answ)) {
                  // Отображение ответа
                  answ.style.display = "block";

                  // Создание блока с полученной информацией
                  let x = document.createElement("DIV");
                  x.appendChild(quest.cloneNode(true));
                  x.appendChild(answ.cloneNode(true));
                  document.body.appendChild(x);

                  // Вывод в консоль для проверки
                  console.log("Remember:" + x.innerHTML);

                  // Запомнить текущий вопрос
                  chrome.storage.sync.set({
                    keepedFile: x.innerHTML
                  });

                  // Загрузка html файла 
                  downloadFile(x, 'content');
                  document.body.removeChild(x);

                  // Переход к следующему
                  document.getElementsByName("gonext")[0].click();
                }
              }, 2000);
            } else { // пользователь нажал 'Cancel'
              // Сообщение пользователю о завершении
              notification($(answ).closest("td"), {
                text: "Вы многое потеряли, но мы не в обиде",
                color: "rgb(255, 128, 128)"
              });
            }
          } else { // вопрос сохранен, происходит сравнение с текущим вопросом
            // Таймер для ожидания нажатия кнопки остановки 
            var Timer = setTimeout(function () {
              // Если кнопка не нажата => сохранение результатов
              if (isDefined(quest, answ)) {
                // Отображение ответа
                answ.style.display = "block";

                // Создание блока с полученной информацией
                let x = document.createElement("DIV");
                x.appendChild(quest.cloneNode(true));
                x.appendChild(answ.cloneNode(true));

                // Вывод в консоль для проверки
                console.log("Keeped:" + data.keepedFile);
                console.log("Curent:" + x.innerHTML);

                // Сравнение текущего вопроса и сохраненным
                if (data.keepedFile != x.innerHTML) {
                  // Загрузка html файла 
                  document.body.appendChild(x);
                  downloadFile(x, 'content');
                  document.body.removeChild(x);

                  // Переход к следующему
                  document.getElementsByName("gonext")[0].click();
                } else {
                  // Сообщение о завершении прохода
                  notification($(answ).closest("td"), {
                    text: "С этого вопроса мы начали, всего наилучшего",
                    color: "rgb(196, 240, 192)"
                  });

                  // Освобождение памяти
                  chrome.storage.sync.remove(['keepedFile'], function () { });
                }
              }
            }, 2000);
          }
        } else { // обычный авто-режим без проверок
          // Таймер для ожидания нажатия кнопки остановки 
          var Timer = setTimeout(function () {
            // Если кнопка не нажата => сохранение результатов
            if (isDefined(quest, answ)) {
              // Отображение ответа
              answ.style.display = "block";

              // Создание блока с полученной информацией
              let x = document.createElement("DIV");
              x.appendChild(quest.cloneNode(true));
              x.appendChild(answ.cloneNode(true));
              document.body.appendChild(x);

              // Загрузка html файла 
              downloadFile(x, 'content');
              document.body.removeChild(x);

              // Переход к следующему
              document.getElementsByName("gonext")[0].click();
            }
          }, 2000);
        }
      }

      // Не показывать правильный ответ
      if (data.showMode === true) {
        // Кнопка отображения / скрытия ответа
        let showBtn = document.createElement("BUTTON");
        let text = document.createTextNode("Show answer");
        showBtn.appendChild(text);
        showBtn.setAttribute("id", "showIt");
        showBtn.setAttribute("type", "button");
        showBtn.setAttribute("style", "background-color: rgb(173, 197, 255);");
        button.parentElement.appendChild(showBtn);
        button.parentElement.getElementsByTagName('BR')[1].remove();

        // Отображение ответа
        $('#showIt').click(function () {
          if (answ.style.display === "none") {
            answ.style.display = "block";
            $('#showIt').text("Hide answer");
          } else {
            answ.style.display = "none";
            $('#showIt').text("Show answer");
          }
        });
      }

      // Режим восстановления состояния теста
      if (data.recoveryMode === true) {
        // Если файл для проверки не загружен
        if (data.recoveryFile === undefined) {
          // Кнопка для показа формы
          let recBtn = document.createElement("BUTTON");
          let text = document.createTextNode("Upload file");
          recBtn.appendChild(text);
          recBtn.setAttribute("id", "recovery");
          recBtn.setAttribute("type", "button");
          if (button.parentElement.getElementsByTagName('BR')[1] != undefined) {
            button.parentElement.getElementsByTagName('BR')[1].remove();
            recBtn.setAttribute("style", "background-color: rgb(243, 247, 124);");
          } else
            recBtn.setAttribute("style", "background-color: rgb(243, 247, 124); margin-left: 8px");
          button.parentElement.appendChild(recBtn);

          // Блок загрузки файла
          let uploadForm = document.createElement("DIV");
          uploadForm.setAttribute("id", "uploadForm");
          uploadForm.setAttribute("style", "margin: 10px 0 20px 0");

          // Поле с информацией
          let textField = document.createElement("SPAN");
          let textFieldMsg = document.createTextNode(
            "Загрузите ваш html файл с вопросами, чтобы мы могли узнать," +
            "\n на чем вы остановились в прошлый раз"
          );
          textField.appendChild(textFieldMsg);
          textField.setAttribute("style", "color: rgb(140, 136, 136); white-space: pre-line;");
          uploadForm.appendChild(textField);
          uploadForm.appendChild(document.createElement("BR"));

          // Форма для загрузки файлов
          let input = document.createElement("INPUT");
          input.setAttribute("type", "file");
          input.setAttribute("id", "file");
          input.setAttribute("name", "file");
          uploadForm.appendChild(document.createElement("BR"));
          uploadForm.appendChild(input);

          button.parentElement.appendChild(uploadForm);
          uploadForm.style.display = "none";

          // Отображение формы для загрузки файла
          $('#recovery').click(function () {
            if (uploadForm.style.display === "none") {
              uploadForm.style.display = "block";
              $('#recovery').text("Hide form");
            } else {
              uploadForm.style.display = "none";
              $('#recovery').text("Upload file");
            }
          });

          // Отправка файла и запуск процесса восстановления
          input.addEventListener('change', function () {
            if (file.files.length) {
              readFile(this.files[0], function (e) {
                if (isDefined(quest, answ)) {
                  // Чтение html в массив 
                  let html = e.target.result.match(/<body>([^]+?)<\/body>/g);
                  // Получение последнего вопроса в файле
                  var last = html[html.length - 1];
                  let body = "<body>";
                  let bodyEnd = "</body>";
                  last = last.substring(last.indexOf(body) + body.length, last.indexOf(bodyEnd));
                  last = last.replace(/[^<p>]{0,}<p>([0-9]+). /g, '<p>');
                  // Создание блока с полученной информацией
                  answ.style.display = "block";
                  let x = document.createElement("DIV");
                  x.appendChild(quest.cloneNode(true));
                  x.appendChild(answ.cloneNode(true));
                  // Вывод в консоль для проверки
                  console.log("File:   " + last);
                  console.log("Curent: " + x.innerHTML);
                  // Сравнение текущего вопроса и последнего вопроса в файле
                  if (last.trim() != x.innerHTML) {
                    // Вопрос пользователю
                    if (confirm("Вы остановились не на этом вопросе.\n" +
                      "Запустить процесс восстановления состояния теста?")) { // пользователь нажал 'Ok'
                      // Сохранить последний вопрос в chrome.storage
                      chrome.storage.sync.set({
                        recoveryFile: last
                      });
                      // Переход к следующему
                      document.getElementsByName("gonext")[0].click();
                    } else {
                      // Сообщение пользователю
                      notification($(answ).closest("td"), {
                        text: "Вы отказались от восстановления состояния теста",
                        color: "rgb(255, 128, 128)"
                      });
                      uploadForm.style.display = "none";
                    }
                  } else {
                    // Сообщение о завершении восстановления состояния теста
                    notification($(answ).closest("td"), {
                      text: "Это последний вопрос в файле",
                      color: "rgb(196, 240, 192)"
                    });
                    // Освобождение памяти
                    chrome.storage.sync.remove(['recoveryFile'], function () { });
                  }
                }
              });
            }
          });
        } else { // файл для проверки загружен, идет процесс восстановления состояния
          // Сообщение пользователю
          notification($(answ).closest("td"), {
            text: "Меня можно остановить, если убрать галочку в меню",
            color: "rgb(255, 128, 128)"
          });
          if (isDefined(quest, answ)) {
            // Создание блока с полученной информацией
            answ.style.display = "block";
            let x = document.createElement("DIV");
            x.appendChild(quest.cloneNode(true));
            x.appendChild(answ.cloneNode(true));
            // Вывод в консоль для проверки
            console.log("File:   " + data.recoveryFile);
            console.log("Curent: " + x.innerHTML);
            // Сравнение текущего вопроса и последнего вопроса в файле
            if (data.recoveryFile.trim() != x.innerHTML) {
              // Переход к следующему
              document.getElementsByName("gonext")[0].click();
            } else {
              // Сообщение о завершении восстановления состояния теста
              notification($(answ).closest("td"), {
                text: "Это последний вопрос в файле",
                color: "rgb(196, 240, 192)"
              });
              // Освобождение памяти
              chrome.storage.sync.remove(['recoveryFile'], function () { });
            }
          }
        }
      };
    } else {
      console.log("Вы не вошли в систему");
    };
  });
})(window);