#!/bin/bash

rm -rf /usr/share/nginx/web/Chatscrum-Angular && mkdir -p /usr/share/nginx/web/Chatscrum-Angular && ng build --prod --aot && cp -r ./dist/fasmail/* /usr/share/nginx/web/Chatscrum-Angular
