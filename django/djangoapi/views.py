from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.conf import settings
from flask import Flask
from flask_mail import Mail, Message
import os
import boto3
import collections
import mailparser
import json
import yagmail
import threading
from .settings_secret import *
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.http import HttpResponse, HttpResponseRedirect
from datetime import datetime
import os.path
import ast
from os import path
from botocore.exceptions import ClientError
# Create your views here.


def get_client():
   return boto3.client(
      's3',
      aws_access_key_id=aws_access_key,
      aws_secret_access_key=aws_secret_key
   )   

def index(request):
    return HttpResponse("Welcome to the fasmail api")

def uploading_sent_emails(user):
    userid = user[0:user.index('@')]
    s3 = boto3.resource('s3', aws_access_key_id=aws_access_key,
                        aws_secret_access_key=aws_secret_key)
    if path.exists('{user}.eml'.format(user=userid)):
        s3.Bucket(bucket).upload_file(
            '{user}.eml'.format(user=userid), user+'/sent/{user}.eml'.format(user=userid))
    else:
        pass
    return JsonResponse({'uploaded':'file uploaded succesfully!'})

def save_sent_email(user, to, subject, message, time):
    user_sending_email = user
    to_email = to
    subject = subject
    message = message.replace('\n', '<br>')
    message = message.replace("'", "&#39;")
    time = str(time)
    f = open('{user_sending}.eml'.format(
        user_sending=user_sending_email[0:user_sending_email.index('@')]), 'a+')
    f.write("{'From': '%(from_email)s', 'To': '%(to_email)s', 'Subject': '%(subject)s', 'Message': '%(message)s', 'Time': '%(time)s'}" % {
            'from_email': user_sending_email, 'to_email': to_email, 'message': message, 'subject': subject, 'time': time})
    f.write('\n')
    f.close()
    uploading_sent_emails(user_sending_email)
    return


@csrf_exempt 
def mail(request):
    user_sending_email = request.POST.get('frommail')
    from_email = mail_from
    subject = request.POST.get('subject')
    message = request.POST.get('msgb')
    to_email = request.POST.get('tomail')
    time = datetime.now()
    send_mail(subject, message, from_email, [to_email])
    # # save_sent_email(user_sending_email, to_email, subject, message, time)

    t = threading.Thread(
        target=save_sent_email,
        args=[user_sending_email, to_email, subject, message, time]
        )
    t.setDaemon(True)
    t.start()
    return JsonResponse("Email Sent!", safe=False)
    

@csrf_exempt 
def smail(request):
    UPLOAD_FOLDERS = settings.UPLOAD_FOLDER
    if request.method == 'POST':
        if not 'attach' in request.FILES:
            contents = [request.POST.get('msgb')]
            msg = Message(request.form.get('subject'), sender = settings.mail_from, recipients = [request.form.get('tomail')])
            msg.body = request.form.get('msgb')
            mail.send(msg)
            return JsonResponse("Email Sent!") 
        if 'attach' in request.FILES:
            f = request.FILES['attach']
            f.save(os.path.join(UPLOAD_FOLDERS, f.filename))
            h = os.path.join(UPLOAD_FOLDERS,f.filename)
            contents = [request.POST.get('msgb'), h]
            yag = yagmail.SMTP({mail_username:request.POST.get('frommail')}, mail_password, host=mail_server, port=587, smtp_starttls=True, smtp_ssl=False)
            yag.send(request.POST.get('tomail'), request.POST.get('subject'), contents)
            return JsonResponse("Email Sent!",safe=False)


def list_content_and_parse(id):
    id = id
    conn = get_client()
    final_list = []
    received_mails_folder = []
    try:
        check = conn.list_objects(Bucket=bucket, Prefix=id) == True
        if check == False:
            conn.put_object(Bucket=bucket, Key=id+'/received/')
            conn.put_object(Bucket=bucket, Key=id+'/sent/')
    except:
        check
        pass

    for ie in conn.list_objects(Bucket=bucket, Prefix=id+'/received/')['Contents']:
        if ie['Key'][-1] != '/':
            received_mails_folder.append(ie['Key'])
        # elif ie['Key'][-1] != '/':
        #     sent_mails_folder.append(ie['Key'])
        else:
            pass
        

    for list_values in received_mails_folder:
        user_content = {}
        data = conn.get_object(Bucket=bucket, Key=list_values)
        read_content = data['Body'].read()
        mail = mailparser.parse_from_bytes(read_content)
        receiver_name,receiver_mail = [x for x in mail.to][0]
        sender_name,sender_mail =  [x for x in mail.from_][0]
        subject = mail.subject
        content = list(mail.text_plain)
        body = mail.body
        date = mail.date
        user_content['TO'] = receiver_mail
        user_content['FROM'] = sender_mail
        user_content['SUBJECT'] = subject
        user_content['MESSAGE'] = content
        user_content['NAME'] = sender_name
        user_content['DATE'] = str(date)
        final_list.append(user_content)
    return final_list


def find_user_content(request):
    id=0
    if 'id' in request.GET:
        id = request.GET['id']
    else:   
        return HttpResponse("Error: No id field provided. Please specify an id.")
    s3 = get_client()
    sent_emails = []
    user_s_emails = id[0:id.index('@')]+'.eml'
    try:
        with open(user_s_emails, 'wb') as f:
            s3.download_fileobj(bucket, id+'/sent/'+user_s_emails, f)
        d_file = open(user_s_emails, 'r')
        read_mails = d_file.readlines()
        for lines in read_mails:
            sent_emails.append(ast.literal_eval(lines[0:-1]))

    except ClientError as e:
        print('user has no sent emails') if e.response['Error']['Code'] == '404' else print(e)
        pass
    
    final_list = list_content_and_parse(id)
    if len(final_list) == 0:
        return JsonResponse({'received_emails': ['no email in inbox!'], 'sent_emails': sent_emails})
    else:
        mail_list = []
        for find_mail in final_list:
            if id == find_mail['TO']:
                mail_list.append(find_mail)

        sortedArray = sorted(
            mail_list,
            key=lambda x: datetime.strptime(x['DATE'], '%Y-%m-%d %H:%M:%S'),reverse=True
        )

                
        initial_keys_to_check = [x['FROM'] for x in sortedArray]
        keys_to_check = list(set(initial_keys_to_check))

        sorted_list =[]

        for key_to_check in keys_to_check:
            new_list =  list(filter(lambda x: x["FROM"] in key_to_check, sortedArray))
            sorted_list.append(new_list)

        s = json.dumps(sortedArray)
        loaded = json.loads(s)
        dictionary = {}
        for item in loaded:
            FROM = item["FROM"]
            MESSAGE = item["MESSAGE"] 
            DATE = item["DATE"] # Date
            if FROM not in dictionary: # If it hasn't been seen before
                dictionary[FROM] = item.copy() # To preserve TO, SUBJECT, ...
                del dictionary[FROM]["MESSAGE"] # No more >:)
                dictionary[FROM]["MESSAGE-DATE"] = [] # This
            dictionary[FROM]["MESSAGE-DATE"].append((MESSAGE, DATE)) # Here, the message and date are combined into a single item as a tuple
        for key in dictionary:
            # print ("works")
            new = ([dictionary[key] for key in dictionary])

        old = sorted(
            new,
            key=lambda x: datetime.strptime(x['DATE'], '%Y-%m-%d %H:%M:%S'), reverse=True
        )
        return JsonResponse({'received_emails': new, 'sent_emails': sent_emails})


@csrf_exempt
def delete_message(request):
    s3 = get_client()
    user = request.POST.get('receiversEmail')
    sender = request.POST.get('sendersEmail')
    msg_date = request.POST.get('msgDate')
    received_mail_folder = []
    
    for ie in s3.list_objects(Bucket=bucket, Prefix=user+'/received/')['Contents']:
        if ie['Key'][-1] != '/':
            received_mail_folder.append(ie['Key'])
    for file_to_delete in received_mail_folder:
        data = s3.get_object(Bucket=bucket, Key=file_to_delete)
        read_content = data['Body'].read()
        mail = mailparser.parse_from_bytes(read_content)
        sender_name, sender_mail = [x for x in mail.from_][0]
        dateEmail = mail.date
        if str(dateEmail) == str(msg_date) and sender == sender_mail:
            s3.delete_object(Bucket=bucket, Key=file_to_delete)
    return JsonResponse({'success': 'Message deleted successfully'})
