# stage1 as builder
FROM node:erbium-alpine as builder
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM nginx:alpine
COPY docker/www/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /dist /usr/share/nginx/html
EXPOSE ${EXPOSE} 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
