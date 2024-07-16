FROM registry.cn-shanghai.aliyuncs.com/shuzhixinghua/node:16.17.0

USER root

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm set registry https://registry.npmmirror.com

RUN npm cache clean --force

RUN npm i

# Bundle app source
COPY . .

RUN npm run build

CMD [ "npm", "run", "preview" ]
