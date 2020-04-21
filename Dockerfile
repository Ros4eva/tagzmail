##Search for ciapi.chatscrum.com and change to your ip address with port 5000.
##Save the file
##Build a new docker image using this dockerfile
##Run the docker image with ports 5000 and 5100 linked also to the redis container and database container.



FROM centos:7

MAINTAINER The CentOS Project <cloud-ops@centos.org>

LABEL Vendor="CentOS" \
      License=GPLv2 \
      Version=2.4.6-40

RUN yum -y install wget epel-release
RUN yum -y --setopt=tsflags=nodocs update && \
    yum -y --setopt=tsflags=nodocs install httpd && \
    yum clean all

RUN yum -y update && yum -y install git

RUN yum -y install httpd-devel \
                   zlib-devel \
                   bzip2-devel \
                   openssl-devel \
                   ncurses-devel \
                   sqlite-devel \
                   readline \
                   https://centos7.iuscommunity.org/ius-release.rpm \
                   python36u \
                   python36u-pip \
                   python36u-devel \
                   uwsgi \
                   uwsgi-plugin-python36u \
                   nginx \
                   python-pip \
                   mysql-devel

RUN yum -y group install "Development Tools"

RUN  yum clean all;

RUN yum -y install gcc

RUN pip install --upgrade pip && pip install boto && pip install boto3 && pip install django-background-task
RUN yum -y install https://centos7.iuscommunity.org/ius-release.rpm python36u python36u-devel python36u-pip
RUN /bin/pip3.6 install django==2.1
#RUN /bin/pip3.6 install channels
RUN /bin/pip3.6 install djangorestframework
RUN /bin/pip3.6 install django-cors-headers
RUN /bin/pip3.6 install mysqlclient
RUN /bin/pip3.6 install mysql-connector-python
RUN /bin/pip3.6 install djangorestframework-jwt
RUN /bin/pip3.6 install Pillow weasyprint yagmail wand xhtml2pdf
RUN /bin/pip3.6 install stripe selenium django-ckeditor boto django-background-tasks pycrypto
RUN /bin/pip3.6 install boto3 django-ses django-amazon-ses flask flask-mail mail-parser

RUN mkdir -p /web/
COPY * /web/www/
COPY nginx.conf /etc/nginx/
COPY start.sh /start.sh
RUN chmod +x /start.sh
COPY ang.sh /ang.sh
RUN chmod +x /ang.sh
# COPY ../settings_secret.py /web/www/django/djangoapi/settings_secret.py

RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . $HOME/.nvm/nvm.sh && nvm install stable
RUN . $HOME/.nvm/nvm.sh && npm install -g yarn
RUN . $HOME/.nvm/nvm.sh && yarn global add @angular/cli@7.3.9
RUN git config --global user.email "prosper.sopuruchi@gmail.com"
RUN git config --global user.name "Prosper Ndubueze"
RUN cd /web/tagzmail && . $HOME/.nvm/nvm.sh && npm install

# RUN cd /web/tagzmail/ && sed -i 's/127.0.0.1:8000/int.linuxjobber.com/' src/app/data.service.ts;

# RUN cd /web/tagzmail/ && sed -i 's/127.0.0.1:9000/intfasmailapi.linuxjobber.com/' src/app/data.service.ts;

RUN cd /web/tagzmail && . $HOME/.nvm/nvm.sh &&  ng build --prod --aot
RUN mkdir -p /usr/share/nginx/web/tagzmail
RUN yes | cp -r /web/tagzmail/dist/tagzmail/* /usr/share/nginx/web/tagzmail



RUN chgrp -R 0 /start.sh /web/www/django/* /run /etc /usr/share/nginx /var/lib /var/log \
    && chmod -R g=u /start.sh /web/www/django/* /run /etc /usr/share/nginx /var/lib /var/log

EXPOSE 4300 9000 

CMD ["/start.sh"]
