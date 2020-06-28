FROM node:14.1-alpine AS nlw_web
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --silent
COPY . .
# EXPOSE $CONTAINER_PORT
# CMD ["npm", "start"]

FROM nginx:stable-alpine AS nlw_web_ngnix
COPY --from=nlw_web /usr/src/app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE $CONTAINER_WEBPORT
CMD ["nginx", "-g", "daemon off;"]