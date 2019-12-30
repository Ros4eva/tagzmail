from flask import Flask, json,request
import boto3
import mailparser
from botocore.exceptions import ClientError
from boto3 import client
from flask import jsonify
import settings
import os
import json

api = Flask(__name__)

def get_client():
   return client(
      's3',
         aws_access_key_id=settings.aws_access_key,
     	 aws_secret_access_key=settings.aws_secret_key
   )

def list_content_and_parse():
    '''
   # input: BucketID
    #ouput: List
    '''    
    conn = get_client()
    contents =[]
    for key in conn.list_objects(Bucket=settings.bucket)['Contents']:
        contents.append(key['Key'])
        #Finds every eml file     
        eml_dict = {}
        eml_list = []
        for find_eml in contents:
            if(find_eml[-1] != "/"):
            	eml_list.append(find_eml)
            eml_dict[find_eml.split('/')[1]] = find_eml.split('/')[-1]
                

    final_list = []
    #Read eml files and assigns content to dicitonary
    for list_values in eml_list:
        user_content = {}
        data = conn.get_object(Bucket=settings.bucket,Key=list_values )
        read_content = data['Body'].read()
        mail = mailparser.parse_from_bytes(read_content)
        receiver_name,receiver_mail = [x for x in mail.to][0]
        sender_name,sender_mail =  [x for x in mail.from_][0]
        subject = mail.subject
        content = list(mail.text_plain)
        body = mail.body
        #print(content)
        user_content['TO'] = receiver_mail
        user_content['FROM'] = sender_mail
        user_content['SUBJECT'] = subject
        user_content['Message'] = content
        final_list.append(user_content)
    return final_list


@api.route('/api/v1.0/get_user_detail/',methods=['GET'])
def find_user_content():
    '''
   This function checks if a user is registered and pulls their mail contents from bucket in json
    arg: registered mail of user
    output: json file showing the user details with every mail sent to user
    '''
    id=0
    if 'id' in request.args:
        id = request.args['id']
    else:
        return "Error: No id field provided. Please specify an id."
    
    final_list = list_content_and_parse()
    #print(final_list)
    mail_list = []
    for find_mail in final_list:
    #	print(find_mail)
        if id == find_mail['TO']:
            mail_list.append(find_mail)
    return jsonify(mail_list)


if __name__ == '__main__':
    api.run(debug=True)

