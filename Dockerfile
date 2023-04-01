FROM ghcr.io/getimages/ubuntu:18.04
USER root
ENV APP_DIR="/app"

WORKDIR ${APP_DIR}
RUN apt-get update && apt-get -y install curl software-properties-common
RUN apt-get update 
RUN apt-get update && apt-get -y install ffmpeg
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get -y install nodejs
COPY ["package.json", "package-lock.json*", "./"] 
RUN npm install 
COPY . .
EXPOSE 1935 8000 8443

CMD [ "node", "bin/app.js"]
