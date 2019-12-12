from flask import Flask
from flask_mail import Mail, Message
import yagmail
from flask_cors import CORS
from flask import request
from flask import jsonify
import boto3


app =Flask(__name__)
CORS(app)
mail=Mail(app)

app.config.from_pyfile('config.cfg')

#app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_SERVER']
app.config['MAIL_PORT'] = 465
#app.config['MAIL_USERNAME'] = 'nathanoluwaseyi@gmail.com'
app.config['MAIL_USERNAME']
#app.config['MAIL_PASSWORD'] = 'anjolaoluwa'
app.config['MAIL_PASSWORD']
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)


def get_client():
   return boto3.client(
      's3',
      aws_access_key_id='*********************',
      aws_secret_access_key='**********************'
   )   

@app.route("/")
def index():
   msg = Message('Hello', sender = 'papuzzymaniac@gmail.com', recipients = ['oluwaseyieniayomi@gmail.com'])
   msg.body = "Hello Flask message sent from Flask-Mail"
   mail.send(msg)
   return "Sent"

@app.route("/mail/", methods=['POST'])
def mail_api():
   print (request.files)
   yag = yagmail.SMTP({app.config['MAIL_USERNAME']:request.form.get('frommail')}, app.config['MAIL_PASSWORD'], host=app.config['MAIL_SERVER'], port=587, smtp_starttls=True, smtp_ssl=False)
   yag.send(request.form.get('tomail'), request.form.get('subject'), request.form.get('msgb'), request.files.get('attach'))
   return jsonify("Email Sent!") 

@app.route("/refresh")
def mail_refresh():
   s3 = get_client()  
   list=s3.list_objects(Bucket='ljtestmails')['Contents']
   for s3_key in list:
      s3_object = s3_key['Key']
      if not s3_object.endswith("/"):
         s3.download_file('ljtestmails', s3_object, s3_object)
      else:
         import os
         if not os.path.exists(s3_object):
            os.makedirs(s3_object)
   return "Refreshed"                     



@app.route("/send")
def yaggy():
   yag = yagmail.SMTP({app.config['MAIL_USERNAME']:'gammyd@gmail.com'}, app.config['MAIL_PASSWORD'], host=app.config['MAIL_SERVER'], port=587, smtp_starttls=True, smtp_ssl=False)
   yag.send('oluwaseyieniayomi@gmail.com', 'SUBJECT', 'Helool gvvsab as  dhbdhjbd')
   return "Sent" 




if __name__ == '__main__':
   app.run(debug = True)
