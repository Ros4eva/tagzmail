#!/bin/bash
/usr/sbin/nginx
#cd / && nohup ./ang.sh &
#cd /web/fasmail && nohup ng serve --host 0.0.0.0 --port 4300 &
cd /web/www/django && python3.6 manage.py runserver 0.0.0.0:9000
#/usr/sbin/nginx

