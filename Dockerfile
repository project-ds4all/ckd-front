
FROM nginx:alpine
WORKDIR /usr/src/app
COPY . .
RUN ls
RUN pwd
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]