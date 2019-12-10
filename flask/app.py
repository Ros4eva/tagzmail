from flask import Flask
from flask_mail import Mail, Message
import yagmail
from flask_cors import CORS
from flask import request
from flask import jsonify

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

@app.route("/")
def index():
   msg = Message('Hello', sender = 'papuzzymaniac@gmail.com', recipients = ['oluwaseyieniayomi@gmail.com'])
   msg.body = "Hello Flask message sent from Flask-Mail"
   mail.send(msg)
   return "Sent"

@app.route("/mail/", methods=['POST'])
def mail_api():
   req_data = request.get_json()	
   yag = yagmail.SMTP({app.config['MAIL_USERNAME']:req_data['frommail']}, app.config['MAIL_PASSWORD'], host=app.config['MAIL_SERVER'], port=587, smtp_starttls=True, smtp_ssl=False)
   yag.send(req_data['tomail'], req_data['subject'], req_data['msgb'])
   return jsonify("Email Sent!") 


@app.route("/send")
def yaggy():
   yag = yagmail.SMTP({app.config['MAIL_USERNAME']:'gammyd@gmail.com'}, app.config['MAIL_PASSWORD'], host=app.config['MAIL_SERVER'], port=587, smtp_starttls=True, smtp_ssl=False)
   yag.send('oluwaseyieniayomi@gmail.com', 'SUBJECT', 'Helool gvvsab as  dhbdhjbd')
   return "Sent" 




if __name__ == '__main__':
   app.run(debug = True)
