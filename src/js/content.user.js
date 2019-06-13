/*
 * (c) 2019 BlasterAlex
 * MIT License
 */

// Загрузка файла
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

// Если текст разбит на несколько <p></p>
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

(function (window, undefined) { // нормализация window
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

  // Получение текущих режимов состояний
  chrome.storage.sync.get(['autoMode'], function (result) {
    var autoMode = result.autoMode;
    chrome.storage.sync.get(['showMode'], function (result) {
      var showMode = result.showMode;
      chrome.storage.sync.get(['recoveryMode'], function (result) {
        var recoveryMode = result.recoveryMode;
        chrome.storage.sync.get(['recoveryFile'], function (result) {
          var recoveryFile = result.recoveryFile;

          // Получение правильного ответа
          var answ = $('p:contains("Правильный ответ:")')[1];
          if (answ != undefined) { // если пользователь залогинился
            // Если ответ разбит на несколько <p></p>
            pUnion($(answ).closest("td"), answ);
            // Скрыть ответ 
            if (showMode === true)
              answ.style.display = "none";
            // Полный url к картинкам
            fullURL(answ);

            // Получение вопроса
            let questTR = $($(answ).closest("tbody")).find('tr')[2];
            if ($(questTR).find('p')[0] === undefined)
              questTR = $($(answ).closest("tbody")).find('tr')[3];
            let quest = $(questTR).find('p')[0];
            // Если вопрос разбит на несколько <p></p>
            pUnion(questTR, quest);
            // Полный url к картинкам
            fullURL(quest);

            // Добавление красоты в стили
            let css = 'button:hover{ opacity: 0.9; cursor: pointer }';
            let style = document.createElement('style');
            if (style.styleSheet)
              style.styleSheet.cssText = css;
            else
              style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);

            if (autoMode === false) {
              // Кнопка сохранения в файл
              var button = document.createElement("BUTTON");
              let t = document.createTextNode("Save it");
              button.appendChild(t);
              button.setAttribute("id", "saveIt");
              button.setAttribute("type", "button");
              button.setAttribute("style", "background-color: rgb(169, 245, 171); min-width: 100px; min-height: 30px; margin-bottom: 10px;");
              document.getElementsByName("gocomplete")[0].replaceWith(button);

              // Сохранение результатов
              $('#saveIt').click(function () {
                if (quest === undefined)
                  alert("Вопрос непонятен!");
                else if (answ === undefined) {
                  alert("Ответ непонятен!");
                } else {
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
            } else {
              // Кнопка остановки процесса
              var button = document.createElement("BUTTON");
              let t = document.createTextNode("Stop it");
              button.appendChild(t);
              button.setAttribute("id", "stopIt");
              button.setAttribute("type", "button");
              button.setAttribute("style", "background-color: pink; min-width: 100px; min-height: 30px; margin-bottom: 10px;");
              document.getElementsByName("gocomplete")[0].replaceWith(button);

              $('#stopIt').click(function () {
                clearTimeout(Timer);
              });
              let Timer = setTimeout(function () { // если кнопка не нажата
                // Сохранение результатов
                if (quest === undefined)
                  alert("Вопрос непонятен!");
                else if (answ === undefined) {
                  alert("Ответ непонятен!");
                } else {
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
            // Кнопка отображения ответа
            if (showMode === true) {
              let showBtn = document.createElement("BUTTON");
              let text = document.createTextNode("Show answer");
              showBtn.appendChild(text);
              showBtn.setAttribute("id", "showIt");
              showBtn.setAttribute("type", "button");
              showBtn.setAttribute("style", "background-color: rgb(173, 197, 255); min-width: 100px; min-height: 30px;");
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
            // Восстановить состояние теста
            if (recoveryMode === true) {
              if (recoveryFile === undefined) { // если файл для проверки не загружен
                // Кнопка для показа формы
                let recBtn = document.createElement("BUTTON");
                let text = document.createTextNode("Download file");
                recBtn.appendChild(text);
                recBtn.setAttribute("id", "recovery");
                recBtn.setAttribute("type", "button");
                if (button.parentElement.getElementsByTagName('BR')[1] != undefined) {
                  button.parentElement.getElementsByTagName('BR')[1].remove();
                  recBtn.setAttribute("style", "background-color: rgb(243, 247, 124); min-width: 100px; min-height: 30px;");
                } else {
                  recBtn.setAttribute("style", "background-color: rgb(243, 247, 124); min-width: 100px; min-height: 30px; margin-left: 8px");
                }
                button.parentElement.appendChild(recBtn);

                // Форма для загрузки файлов
                let input = document.createElement("INPUT");
                input.setAttribute("type", "file");
                input.setAttribute("id", "file");
                input.setAttribute("name", "file");
                input.setAttribute("style", "margin-bottom: 10px ");
                button.parentElement.appendChild(document.createElement("BR"));
                button.parentElement.appendChild(input);
                input.style.display = "none";
                // Отправка файла и запуск процесса восстановления
                document.getElementById('file').addEventListener('change', function () {
                  if (file.files.length) {
                    readFile(this.files[0], function (e) {
                      let html = e.target.result.match(/<body>([^]+?)<\/body>/g);
                      let body = "<body>";
                      let bodyEnd = "</body>";
                      var last = html[html.length - 1];
                      last = last.substring(last.indexOf(body) + body.length, last.indexOf(bodyEnd));
                      last = last.replace(/[^<p>]{0,}<p>([0-9]+). /g, '<p>');

                      if (quest === undefined)
                        alert("Вопрос непонятен!");
                      else if (answ === undefined) {
                        alert("Ответ непонятен!");
                      } else {
                        let x = document.createElement("DIV");
                        x.appendChild(quest.cloneNode(true));
                        x.appendChild(answ.cloneNode(true));

                        if (last != x.innerHTML) {
                          chrome.storage.sync.set({
                            recoveryFile: last
                          });
                          // Переход к следующему
                          document.getElementsByName("gonext")[0].click();
                        }
                      }
                    });
                  }
                });
                // Загрузка локального файла
                function readFile(file, onLoadCallback) {
                  let reader = new FileReader();
                  reader.onload = onLoadCallback;
                  reader.readAsText(file);
                }
                // Отображение формы для загрузки файла
                $('#recovery').click(function () {
                  if (input.style.display === "none") {
                    input.style.display = "block";
                    $('#recovery').text("Hide form");
                  } else {
                    input.style.display = "none";
                    $('#recovery').text("Download file");
                  }
                });
              } else {
                if (quest === undefined)
                  alert("Вопрос непонятен!");
                else if (answ === undefined) {
                  alert("Ответ непонятен!");
                } else {
                  let x = document.createElement("DIV");
                  x.appendChild(quest.cloneNode(true));
                  x.appendChild(answ.cloneNode(true));

                  if (recoveryFile != x.innerHTML) {
                    // Переход к следующему
                    document.getElementsByName("gonext")[0].click();
                  }
                }
              }
            };
          };

        });
      });
    });
  });
})(window);