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
import yagmail
from .settings_secret import *
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.http import HttpResponse, HttpResponseRedirect
from datetime import datetime
# Create your views here.


def get_client():
   return boto3.client(
      's3',
      aws_access_key_id=aws_access_key,
      aws_secret_access_key=aws_secret_key
   )   

def index(request):
    return HttpResponse("Welcome to the fasmail api")
 
send_mail(
subject = 'Subject here',
message = 'Here is the message.',
from_email = 'test001@linuxjobber.com',
recipient_list = ['oluwaseyieniayomi@gmail.com'],
fail_silently=False,
)

@csrf_exempt 
def mail(request):
    subject = request.POST.get('subject', '')
    message = request.POST.get('msgb', '')
    from_email = mail_from
    send_mail(subject, message, from_email, [request.POST.get('tomail')])
    safe=False
    return JsonResponse("Email Sent!", safe=False) 



@csrf_exempt 
def smail(request):
    UPLOAD_FOLDERS = settings.UPLOAD_FOLDER
   # print(UPLOAD_FOLDERS)
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
           # print(f.filename)
            h = os.path.join(UPLOAD_FOLDERS,f.filename)
            contents = [request.POST.get('msgb'), h]
            yag = yagmail.SMTP({mail_username:request.POST.get('frommail')}, mail_password, host=mail_server, port=587, smtp_starttls=True, smtp_ssl=False)
            yag.send(request.POST.get('tomail'), request.POST.get('subject'), contents)
            return JsonResponse("Email Sent!",safe=False)

def refresh(request):
    s3 = get_client()  
    lists=s3.list_objects(Bucket=bucket)['Contents']
    for s3_key in lists:
        s3_object = s3_key['Key']
        if not s3_object.endswith("/"):
            try:
                s3.download_file(bucket, s3_object, s3_object)
            except:
                continue
        else:
            if not os.path.exists(s3_object):
                os.makedirs(s3_object)
    
    return JsonResponse({"status":"Refreshed"})                     




def switch_case(num):
   switch={
      'Delivered-To':'Delivered-To',
      'Received':'Received',
      'From':'From',
      'To':'To',
      'Date':'Date'
     # 'Subject':'Subject'
   #   'Body':'Body'
   }
   return switch.get(num, 'none')


def test(request): 
   MAIL_FOLD = 'LJB/LJB01/nsn.eml'
   UPLOADM_FOLDER = os.path.join(settings.BASE_DIR, MAIL_FOLD)
   f=open(UPLOADM_FOLDER, 'r')
   #print(UPLOADM_FOLDER) 
   location_data = []   # index=0
   for line in f:
      line = line.split('/r')
      line=str(line)
      key=line.strip("[''/n] ").split(':')
      location_data.append({switch_case(key[0]):line})   
      
      location_data.append({switch_case(key[0]):key})
     
   location_data = {"location_data": location_data}
         
   return JsonResponse(location_data)       

def mail_test1(request): 
   MAIL_FOLD = 'LJB\\LJB01\\nsn.eml'
   UPLOADM_FOLDER = os.path.join(settings.BASE_DIR, MAIL_FOLD)
   f=open(UPLOADM_FOLDER, 'r')
        
   return HttpResponse(f.read())

def list_content_and_parse():
    '''
   # input: BucketID
    #ouput: List
    '''    
    conn = get_client()
    contents =[]
    for key in conn.list_objects(Bucket=bucket)['Contents']:
        contents.append(key['Key'])
        #Finds every eml file     
        eml_dict = {}
        eml_list = []
        for find_eml in contents:
            if(find_eml[-1] != "/"):
               eml_list.append(find_eml)
            #eml_dict[find_eml.split('/')[1]] = find_eml.split('/')[-1]
            
                

    final_list = []
    #Read eml files and assigns content to dicitonary
    for list_values in eml_list:
        user_content = {}
        data = conn.get_object(Bucket=bucket,Key=list_values )
        read_content = data['Body'].read()
        mail = mailparser.parse_from_bytes(read_content)
        receiver_name,receiver_mail = [x for x in mail.to][0]
        sender_name,sender_mail =  [x for x in mail.from_][0]
        subject = mail.subject
        content = list(mail.text_plain)
        body = mail.body
        date = mail.date
        #print(sender_name)
        #print(content)
        user_content['TO'] = receiver_mail
        user_content['FROM'] = sender_mail
        user_content['SUBJECT'] = subject
        user_content['MESSAGE'] = content
        user_content['NAME'] = sender_name
        user_content['DATE'] = str(date)
        final_list.append(user_content)
        #print(final_list)
    return final_list


def find_user_content(request):
    '''
   This function checks if a user is registered and pulls their mail contents from bucket in json
    arg: registered mail of user
    output: json file showing the user details with every mail sent to user
    '''
    id=0
    if 'id' in request.GET:
        id = request.GET['id']
    else:   
        return HttpResponse("Error: No id field provided. Please specify an id.")
    
    final_list = list_content_and_parse()
    mail_list = []
    for find_mail in final_list:
        if id == find_mail['TO']:
            mail_list.append(find_mail)

    sortedArray = sorted(
        mail_list,
        key=lambda x: datetime.strptime(x['DATE'], '%Y-%m-%d %H:%M:%S'), reverse=True
    )

            
    initial_keys_to_check = [x['FROM'] for x in mail_list]
    keys_to_check = list(set(initial_keys_to_check))

    sorted_list =[]

    for key_to_check in keys_to_check:
        new_list =  list(filter(lambda x: x["FROM"] in key_to_check, final_list))
        sorted_list.append(new_list)
    
    return JsonResponse(sortedArray,safe=False)
