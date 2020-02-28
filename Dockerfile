FROM node:alpine

RUN wget https://noto-website-2.storage.googleapis.com/pkgs/NotoSansCJKjp-hinted.zip -O /tmp/NotoSansCJKjp-hinted.zip &&\
    unzip /tmp/NotoSansCJKjp-hinted.zip -d /tmp &&\
    mkdir -pv /usr/share/fonts/noto/ &&\
    mv /tmp/NotoSansCJKjp-Regular.otf /usr/share/fonts/noto/ &&\
    rm -fr /tmp/*

COPY package.json package-lock.json /usr/local/pdftt/
RUN cd /usr/local/pdftt/ && npm install --prod

ENV PDFGEN_FONT /usr/share/fonts/noto/NotoSansCJKjp-Regular.otf

COPY . /usr/local/pdftt/

RUN ln -sfn /usr/local/pdftt/bin/pdftt.js /usr/local/bin/pdftt
