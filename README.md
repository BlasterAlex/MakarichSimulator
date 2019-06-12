# MakarichSimulator

<img src="data/icons/active-icon.png" align="right" width="90px" style="margin: 0 0 10px 10px" />

<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="86" height="20" style="margin: 0 5px 0 0"><linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="a"><rect width="86" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#a)"><path fill="#555" d="M0 0h51v20H0z"/><path fill="#007ec6" d="M51 0h35v20H51z"/><path fill="url(#b)" d="M0 0h86v20H0z"/></g><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110"> <text x="265" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="410">version</text><text x="265" y="140" transform="scale(.1)" textLength="410">version</text><text x="675" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="250">1.03</text><text x="675" y="140" transform="scale(.1)" textLength="250">v1.03</text></g></svg>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="78" height="20" style="margin: 0 5px 0 0"><linearGradient id="b" x2="0" y2="100%"><stop offset="0" stop-color="#bbb" stop-opacity=".1"/><stop offset="1" stop-opacity=".1"/></linearGradient><clipPath id="a"><rect width="78" height="20" rx="3" fill="#fff"/></clipPath><g clip-path="url(#a)"><path fill="#555" d="M0 0h47v20H0z"/><path fill="#97ca00" d="M47 0h31v20H47z"/><path fill="url(#b)" d="M0 0h78v20H0z"/></g><g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="110"> <text x="245" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="370">license</text><text x="245" y="140" transform="scale(.1)" textLength="370">license</text><text x="615" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="210">MIT</text><text x="615" y="140" transform="scale(.1)" textLength="210">MIT</text></g> </svg>

MakarichSimulator - это расширение для браузера [Google Chrome](https://www.google.com/chrome/?hl=ru), предоставляющее пользователю удобный интерфейс для работы с образовательным порталом.

# Установка
Установка расширения в браузере Google Chrome:

<img src="data/gif/installation-1.gif" width="600"/><img src="data/gif/installation-2.gif" width="600"/>

Для конвертирования загружаемых файлов в pdf необходима программа [wkhtmltopdf](https://wkhtmltopdf.org/). Установка программы для Ubuntu:
```sh
$ sudo apt-get install wkhtmltopdf
```

# Использование 
Сценарий объединения и конвертирования загружаемых файлов находится в файле
```sh
  src/union.sh
```
По умолчанию файлы загружаются в папку 
``$HOME/Загрузки``. После объединения html файлы перемещаются в папку ``$HOME/Документы/Тесты/html``, а сконвертированные в pdf файлы в папку ``$HOME/Документы/Тесты/pdf``

При запуске необходимо указать название название предмета. Настройки списка предметов и папок находятся в файле сценария.  