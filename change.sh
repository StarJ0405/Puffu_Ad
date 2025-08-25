#!/bin/bash

# Back 폴더 안의 change.sh 실행
if [ -d "./Back" ]; then
  if [ -x "./Back/change.sh" ]; then
    cd ./Back
    ./change.sh
    cd ..
    echo "./Back/change.sh 실행 완료"
  else
    echo "./Back/change.sh 파일이 없거나 실행 권한이 없습니다."
  fi
else
  echo "./Back 폴더가 존재하지 않습니다."
fi

# Front 폴더 안의 change.sh 실행
if [ -d "./Front" ]; then
  if [ -x "./Front/change.sh" ]; then
    cd ./Front
    ./change.sh
    cd ..
    echo "./Front/change.sh 실행 완료"
  else
    echo "./Front/change.sh 파일이 없거나 실행 권한이 없습니다."
  fi
else
  echo "./Front 폴더가 존재하지 않습니다."
fi

exit 0
