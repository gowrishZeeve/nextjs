FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]