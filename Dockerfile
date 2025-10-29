FROM puffusoft/ubuntu_base as builder
# 프론트 빌드(React 혹은 Next.js)
WORKDIR /Front
COPY /Front/*.json /Front/
COPY /Front/.env* /Front/
RUN npm install
COPY /Front/public /Front/
COPY /Front/src/. /Front/src/
COPY /Front/*.mjs /Front/
COPY /Front/*.ts /Front/
COPY /Front/*.tsx /Front/
RUN npm run build

# 백엔드(Java)
# WORKDIR /Back
# COPY ./Back/src/. /Back/src/
# COPY ./Back/gradlew /Back/
# COPY ./Back/build.gradle /Back/
# COPY ./Back/gradle/. /Back/gradle/
# COPY ./Back/settings.gradle /Back/
# RUN chmod +x ./gradlew
# RUN ./gradlew bootJar

# 백엔드(Express)
WORKDIR /Back
COPY /Back/*.json /Back/
COPY /Back/yarn.lock /Back/
COPY /Back/.env* /Back/
RUN yarn
COPY /Back/src/. /Back/src/
COPY /Back/*.mjs /Back/
COPY /Back/*.ts /Back/
COPY /Back/*.tsx /Back/
RUN yarn build

FROM puffusoft/ubuntu_base
WORKDIR /builder

# 프론트(React)
# COPY --from=builder /Front/build/. /builder/Front/build2/

# 프론트(Next.js)
COPY --from=builder /Front/.next/. /builder/Front/.next2/

# 프론트 공통파일
COPY ./Front/public/. /builder/Front/public/.
COPY ./Front/package*.json /builder/Front/
COPY ./Front/.env* /builder/Front/
# 백엔드(Java)
# COPY --from=builder /Back/build/libs/*.jar /builder/Back/

# 백엔드(Express)
COPY --from=builder /Back/dist/. /builder/Back/dist2/

# 백엔드 공통파일
COPY ./Back/package*.json /builder/Back/
COPY ./Back/yarn.lock /builder/Back/
COPY ./Back/.env* /builder/Back/

# 이미지 자체로 서버 돌리는 경우 제외 사용 금지(copy용으로는 node_modules 없는게 좋음)
# WORKDIR /builder/Front
# RUN npm i
# WORKDIR /builder/Back
# RUN yarn

# 환경 체크가 필요한 경우에만 사용
# WORKDIR /
# COPY run.sh run.sh
# RUN chmod +x ./run.sh
# CMD ["/run.sh"]

# 위에 것 사용시 주석처리할것!
WORKDIR /
COPY copy.sh copy.sh
RUN chmod +x ./copy.sh
CMD ["/copy.sh"]