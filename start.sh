#!/bin/bash

cd /web/www/flask && nohup python3.6 app.py &
/usr/sbin/nginx
