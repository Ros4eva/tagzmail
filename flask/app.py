from flask import Flask
from flask_mail import Mail, Message
import yagmail
from flask_cors import CORS
from flask import request
from flask import jsonify
import boto3
import os
from werkzeug.utils import secure_filename
import settings


app =Flask(__name__)
CORS(app)
mail=Mail(app)

APP_ROOT = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLD = 'attachments/'
UPLOAD_FOLDER = os.path.join(APP_ROOT, UPLOAD_FOLD)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


app.config.from_pyfile('config.cfg')

app.config['MAIL_SERVER']
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME']
app.config['MAIL_PASSWORD']
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True
mail = Mail(app)


def get_client():
   return boto3.client(
      's3',
      aws_access_key_id=settings.aws_access_key,
      aws_secret_access_key=settings.aws_secret_key
   )   

@app.route("/")
def index():
   msg = Message('Hello', sender = 'papuzzymaniac@gmail.com', recipients = ['oluwaseyieniayomi@gmail.com'])
   msg.body = "Hello Flask message sent from Flask-Mail"
   mail.send(msg)
   return "Sent"

@app.route("/mail/", methods=['POST'])
def mail_api():
   if not 'attach' in request.files:
      contents = [request.form.get('msgb')]
      yag = yagmail.SMTP({settings.mail_username:request.form.get('frommail')}, settings.mail_password, host=settings.mail_server, port=587, smtp_starttls=True, smtp_ssl=False)
      yag.send(request.form.get('tomail'), request.form.get('subject'), contents)
      return jsonify("Email Sent!") 

   if 'attach' in request.files:
      f = request.files['attach']
      f.save(os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename)))
      print(secure_filename(f.filename))
      h = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename))
      contents = [request.form.get('msgb'), h]
      yag = yagmail.SMTP({settings.mail_username:request.form.get('frommail')}, settings.mail_password, host=settings.mail_server, port=587, smtp_starttls=True, smtp_ssl=False)
      yag.send(request.form.get('tomail'), request.form.get('subject'), contents)
      return jsonify("Email Sent!") 

@app.route("/refresh")
def mail_refresh():
   s3 = get_client()  
   list=s3.list_objects(Bucket=settings.bucket)['Contents']
   for s3_key in list:
      s3_object = s3_key['Key']
      if not s3_object.endswith("/"):
         s3.download_file(settings.bucket, s3_object, s3_object)
      else:
         import os
         if not os.path.exists(s3_object):
            os.makedirs(s3_object)
   return "Refreshed"                     



@app.route("/send")
def yaggy():
   yag = yagmail.SMTP({settings.mail_username:'gammyd@gmail.com'}, settings.mail_password, host=settings.mail_server, port=587, smtp_starttls=True, smtp_ssl=False)
   yag.send('oluwaseyieniayomi@gmail.com', 'SUBJECT', 'Helool gvvsab as  dhbdhjbd')
   return "Sent" 




if __name__ == '__main__':
   app.run(debug = True)
