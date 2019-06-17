# (c) 2019 BlasterAlex
# MIT License

#!/bin/bash

# Папки для хранения файлов
rootDir=$HOME'/Документы/Тесты/'
htmlDir=$rootDir'html/'
pdfDir=$rootDir'pdf/'

# Папка для загрузок
downDir=$HOME'/Загрузки/'

# Список предметов
subjects=('Terver' 'Matan' 'AOS' 'OOP')

# Шаблон файлов для поиска
tempName="content"
tempExt="html"

# Для отслеживания повторений
saveFileName=false

# Цветной вывод сообщения в консоль
# $1 - тип сообщения (error, info)
# $2 - текст сообщения
output() { 
  case "$1" in
    'error') echo -e "\e[0;31mERROR: \e[0m $2" ;;
    'info') echo -e "\e[0;36mINFO: \e[0m $2" ;;
    *) echo "$1: $2" ;;
  esac 
}

# Выбор предмета
if [ -n "$1" ]; then # если есть параметры
  sub=0 # номер предмета в массиве
  for item in ${subjects[@]}; do
    # Поиск предмета в массиве без учета регистра
    if [ "${1,,}" = "${item,,}" ]; then break; fi 
    ((++sub))
  done
  if [[ $sub == ${#subjects[*]} ]]; then 
    output 'error' "Неизвестный параметр '$1'!" 
    exit
  fi
else
  output 'error' 'Необходимо ввести название предмета!'
  exit
fi

# Создать папки, если не найдены
mkdir -p $rootDir
mkdir -p $htmlDir
mkdir -p $pdfDir

# Проверка на существование папки загрузок
if ! [ -d "$downDir" ]; then
  output 'error' 'Папка загрузок не найдена!'
  exit
fi

# Проход по файлам в загрузках
target="$htmlDir""${subjects[sub]}.html"
check=fasle
if [[ `find "$downDir" -maxdepth 1 -name "$tempName*.$tempExt" | wc -l` == 0 ]]; then
  output 'info' 'В загрузках нет новых файлов'
else
  for file in "$downDir""$tempName"*."$tempExt"; do
    # Если в папке еще нет файла по этому предмету
    if ! [ -f "$htmlDir""${subjects[sub]}.html" ]; then
      if [[ $saveFileName != true ]]; then cat "$file" | sed "0,/<p>/s//<p>1. /" > "$target"
      else cat "$file" | sed "0,/<p>/s//<p>1. /" | sed "0,/<\/body>/s//  <p><b>Файл: <\/b>${file##*/}<\/p>\n<\/body>/" > "$target"
      fi
      rm "$file"
      check=true
    else
      # Проверка на дублирование
      # без тега <p>, чтобы не учитывалась нумерация
      content=`cat "$file" | grep '<p>'`
      content=`echo $content | sed 's/<p>//1'`
      if [[ `cat "$target" | grep -c "$content"` == 0 ]]; then
        check=true

        # Получение номера последнего вопроса в файле  
        number=`tac "$target" | grep -o -m 1 '<p>[0-9]\+\. ' | sed 's/<p>\(.*\)\./\1/'`
        ((number++))

        # Добавление номера и имени файла к новому вопросу
        if [[ $saveFileName != true ]]; then cat "$file" | sed "0,/<p>/s//<p>$number. /" > "$file"'t'
        else cat "$file" | sed "0,/<p>/s//<p>$number. /" | sed "0,/<\/body>/s//  <p><b>Файл: <\/b>${file##*/}<\/p>\n<\/body>/" > "$file"'t'
        fi
        mv "$file"'t' "$file"

        # Добавление отступа
        echo >> "$target"

        # Добавление нового вопроса в файл
        cat "$target" "$file" > "$htmlDir"'temp'
        mv "$htmlDir"'temp' "$target"

        # Удаление файла вопроса и папки, если она есть
        rm "$file"
        if [ -d "${file%.*}" ]; then rm -R "${file%.*}"; fi
      else
        # Если такой вопрос уже есть в файле
        output 'info' "Вопрос из файла '$file' уже существует"
      fi 
    fi
  done
  # Конвертирование в pdf
  if [[ $check == true ]]; then
    output 'info' 'Конвертирование...'
    wkhtmltopdf "$target" "$pdfDir""${subjects[sub]}.pdf"
  else
    output 'info' 'В загрузках нет новых файлов'
  fi
fi
