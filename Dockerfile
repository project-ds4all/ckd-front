
FROM nginx:alpine
WORKDIR /usr/src/app
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]