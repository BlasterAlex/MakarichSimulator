#!/bin/bash

# Папки для хранения файлов
rootDir=$HOME'/Документы/Тесты/'
htmlDir=$rootDir'html/'
pdfDir=$rootDir'pdf/'

# Папка для хранения файлов
downDir=$HOME'/Загрузки/'
if ! [ -d "$downDir" ]; then
  echo "ERROR: Папка загрузок не найдена!"
  exit
fi

# Шаблон файлов для поиска
tempName="content"
tempExt="html"

# Создать папки, если не найдены
mkdir -p $rootDir
mkdir -p $htmlDir
mkdir -p $pdfDir

# Список предметов
subjects=('Diff' 'Matan' 'AOS')

# Выбор предмета
if [ -n "$1" ]; then # если есть параметры
  case "$1" in
    "diff")  sub=0 ;;
    "matan") sub=1 ;;
    "aos")   sub=2 ;;
    *) 
      echo "ERROR: Неизвестный параметр '$1'!" 
      exit
    ;;
  esac
else
  echo "ERROR: Необходимо ввести название предмета!"
  exit
fi

# Проход по файлам в загрузках
target="$htmlDir""${subjects[sub]}.html"
check=fasle
if [[ `find "$downDir" -name "$tempName"*."$tempExt" | wc -l` == 0 ]]; then
  echo "В загрузках нет новых файлов"
else
  for file in "$downDir""$tempName"*."$tempExt"; do
    # Если в папке еще нет файла по этому предмету
    if ! [ -f "$htmlDir""${subjects[sub]}.html" ]; then
      cat "$file" | sed "0,/<p>/s//<p>1. /" | cat > "$target"
      rm "$file"
    else
      # Проверка на дублирование
      # без тега <p>, чтобы не учитывалась нумерация
      content=`cat "$file" | grep '<p>'`
      content=`echo $content | sed 's/<p>//1'`
      if [[ `cat "$target" | grep -c "$content"` == 0 ]]; then
        check=true

        # Получение номера последнего вопроса в файле  
        number=`tac "$target" | grep -m 1 '<p>' | sed -n 's/.*<p>\([0-9]\+\)\..*/\1/p'`
        ((number++))

        # Добавление номера к новому вопросу
        cat "$file" | sed "0,/<p>/s//<p>$number. /" | cat > "$file"'t'
        mv "$file"'t' "$file"

        # Добавление отступа
        echo >> "$target"

        # Добавление нового вопроса в файл
        cat "$target" "$file" > "$htmlDir"'temp'
        mv "$htmlDir"'temp' "$target"

        # Удаление файла вопроса
        rm "$file"
        if [ -d "${file%.*}" ]; then rm -R "${file%.*}"; fi
      fi 
    fi
  done
  # Конвертирование в pdf
  if [[ $check == true ]]; then
    echo "Конвертирование..."
    wkhtmltopdf "$target" "$pdfDir""${subjects[sub]}.pdf"
  else
    echo "В загрузках нет новых файлов"
  fi
fi
