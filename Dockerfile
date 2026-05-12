FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY *.html *.css *.js .nojekyll /usr/share/nginx/html/
COPY audio /usr/share/nginx/html/audio
