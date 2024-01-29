FROM node:18-alpine

WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 80

ENTRYPOINT [ "./entrypoint.sh" ]

CMD ["npm", "run", "start:dev"]
