// ==UserScript==
// @name MakarichSimulator
// @description Копирую ответы за вас 
// @author Alex Pish
// @license MIT
// @version 1.3
// ==/UserScript==

// Загрузка файла
function downloadFile(element, filename = '') {
  var html = `<body>
  ${element.innerHTML}
</body>`;

  var file = new Blob(['\ufeff', html], {
    type: 'text/html'
  });

  // Specify link url
  var url = URL.createObjectURL(file);

  // Specify file name
  filename = filename ? filename + '.html' : 'content.html';

  // Create download link element
  var downloadLink = document.createElement("a");
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

function pUnion(from, to) { // если текст разбит на несколько <p></p>
  let i = 0, p = $(from).find('p')[++i];
  while ($(p).text().length > 0) {
    $(to).append($(p));
    p = $(from).find('p')[++i];
  }
}

function fullURL(element) { // полный url к картинкам
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

  // Получение текущего режима состояния
  chrome.storage.sync.get(['autoMode'], function (result) {
    autoMode = result.autoMode;

    // Получение правильного ответа
    var answ = $('p:contains("Правильный ответ:")')[1];
    if (answ != undefined) { // если пользователь залогинился
      // Если ответ разбит на несколько <p></p>
      pUnion($(answ).closest("td"), answ);
      // Скрыть ответ 
      if (autoMode === false)
        answ.style.display = "none";
      // Полный url к картинкам
      fullURL(answ);

      // Получение вопроса
      var questTR = $($(answ).closest("tbody")).find('tr')[2];
      if ($(questTR).find('p')[0] === undefined)
        questTR = $($(answ).closest("tbody")).find('tr')[3];
      var quest = $(questTR).find('p')[0];
      // Если вопрос разбит на несколько <p></p>
      pUnion(questTR, quest);
      // Полный url к картинкам
      fullURL(quest);

      // Добавление красоты в стили
      var css = 'button:hover{ opacity: 0.9; cursor: pointer }';
      var style = document.createElement('style');

      if (style.styleSheet)
        style.styleSheet.cssText = css;
      else
        style.appendChild(document.createTextNode(css));

      document.getElementsByTagName('head')[0].appendChild(style);

      if (autoMode === false) {
        // Кнопка сохранения в файл
        var button = document.createElement("BUTTON");
        var t = document.createTextNode("Save it");
        button.appendChild(t);
        button.setAttribute("id", "saveIt");
        button.setAttribute("type", "button");
        button.setAttribute("style", "background-color: rgb(169, 245, 171); min-width: 100px; min-height: 30px;");
        document.getElementsByName("gocomplete")[0].replaceWith(button);

        // Кнопка отображения ответа
        var showBtn = document.createElement("BUTTON");
        var text = document.createTextNode("Show answer");
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
            var x = document.createElement("DIV");
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
        var t = document.createTextNode("Stop it");
        button.appendChild(t);
        button.setAttribute("id", "stopIt");
        button.setAttribute("type", "button");
        button.setAttribute("style", "background-color: pink; min-width: 100px; min-height: 30px;");
        document.getElementsByName("gocomplete")[0].replaceWith(button);

        $('#stopIt').click(function () {
          clearTimeout(Timer);
        });
        var Timer = setTimeout(function () { // если кнопка не нажата
          // Сохранение результатов
          if (quest === undefined)
            alert("Вопрос непонятен!");
          else if (answ === undefined) {
            alert("Ответ непонятен!");
          } else {
            // Отображение ответа
            answ.style.display = "block";

            // Создание блока с полученной информацией
            var x = document.createElement("DIV");
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
  });
})(window);