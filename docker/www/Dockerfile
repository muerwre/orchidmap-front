# stage1 as builder
FROM node:erbium-alpine as builder

COPY package.json yarn.lock ./

RUN yarn

COPY . .

ARG REACT_APP_PUBLIC_PATH
ARG REACT_APP_API_ADDR
ARG REACT_APP_OSRM_URL
ARG REACT_APP_OSRM_PROFILE

ENV REACT_APP_PUBLIC_PATH $REACT_APP_PUBLIC_PATH
ENV REACT_APP_API_ADDR $REACT_APP_API_ADDR
ENV REACT_APP_OSRM_URL $REACT_APP_OSRM_URL
ENV REACT_APP_OSRM_PROFILE $REACT_APP_OSRM_PROFILE

RUN yarn build

FROM nginx:alpine

COPY docker/www/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /build /usr/share/nginx/html
EXPOSE ${EXPOSE} 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
