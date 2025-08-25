#!/bin/bash

# dist2 폴더 존재 여부 확인
if [ -d "./dist2" ]; then
  # dist 폴더 존재 여부 확인 후 삭제
  if [ -d "./dist" ]; then
    rm -rf "./dist"
    echo "dist 폴더 삭제 완료"
  fi

  # dist2 폴더를 dist1으로 이름 변경
  mv "./dist2" "./dist"
  echo "dist2 폴더를 dist으로 이름 변경 완료"

  # restart.sh 스크립트 실행
  ./restart.sh
  echo "restart.sh 스크립트 실행 완료"
else
  echo "dist2 폴더가 존재하지 않습니다."
fi

exit 0
