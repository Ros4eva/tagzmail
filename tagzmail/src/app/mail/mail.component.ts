import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/index';
import { DataService } from './../data.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MzModalModule } from 'ngx-materialize';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MailModel } from '../model/mail-model';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var $: any;

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})

export class MailComponent implements OnInit {
  form: FormGroup;
  sendNewEmailForm: FormGroup;
  getSubject: FormGroup;
  public username: any;
  public email: any;
  public message;
  public emailMessage;
  public messagebody
  public from;
  public mailer;
  public mailee;
  public user_date;
  public mails: MailModel[];
  public user_message;
  public user_mailer;
  public toEmail = null;
  public subject = '';
  selectedIndex = null;

  userMsg: msg_date[] = [];
  mailList: djangoMail[] = [];

  sent_emails: [] = []
  email_from: any = sessionStorage.getItem('email');
  email_to: any;
  email_subject: any;
  email_message: any;
  email_attachement: File;

  public modalOptions: Materialize.ModalOptions = {
    dismissible: false, // Modal can be dismissed by clicking outside of the modal
    opacity: .5, // Opacity of modal background
    inDuration: 300, // Transition in duration
    outDuration: 200, // Transition out duration
    startingTop: '100%', // Starting top style attribute
    endingTop: '10%', // Ending top style attribute
    ready: (modal, trigger) => { // Callback for Modal open. Modal and trigger parameters available.
      alert('Ready');
      console.log(modal, trigger);
    },
    complete: () => { alert('Closed'); } // Callback for Modal close
  };

  fileData: File = null;

  constructor(
    public dataservice: DataService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private modalModule: MzModalModule,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    public fb: FormBuilder,
    ) {this.form = this.fb.group({
      frommail: [sessionStorage.getItem('email')],
      toemail: [sessionStorage.getItem('mailer')],
      subject: [''],
      messagebody: [''],
      avatar: [null]
    });}


  ngOnInit() {
    //sessionStorage.setItem('email', 'admin@linuxjobber.com')
    sessionStorage.setItem('email', 'josephs@linuxjobber.com')
    if (this.route.snapshot.paramMap.get('email')) {
      this.toEmail = this.route.snapshot.paramMap.get('email');
    }
    this.fetchEmails()
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity();
  }

  logout() {
    this.dataservice.logout();
  }

  sendEmail() {
    let formData: any = new FormData();
    console.log(this.form.get('frommail').value)
    console.log(this.toEmail)
    console.log(this.form.get('messagebody').value)
    if (this.toEmail == null || this.form.get('messagebody').value == null) {
      return;
    } else {
      formData.append('frommail', this.form.get('frommail').value);
      formData.append('tomail', this.toEmail);
      formData.append('subject', this.form.get('subject').value);
      formData.append('msgb', this.form.get('messagebody').value);
      formData.append('attach', this.form.get('avatar').value);
    }


    this.http.post(this.dataservice.domain_protocol + this.dataservice.f_domain_name + '/mail/', formData).subscribe(
      data => {
        this.message = 'Email has been sent.';
        console.log(data)
      },
      err => {
        this.message = 'Email Not sent! Error!';
        console.log(err)
      }
    );
    this.form.reset();
  }

  assignValue() {
    const sample = [
      {
        first_name: 'Test',
        last_name: 'Ologbo',
        content: ['The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from \'de Finibus Bonorum et Malorum\' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.', 'uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. \'Your global Angular CLI version (8.3.20) is greater than your local version (7.0.7). The local Angular CLI version is used'],
        email: 'Test@gmail.com ',
        id: 0
      },
      {
        first_name: 'Oluwaseyi',
        last_name: 'Dane',
        content: [' It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. \'Your global Angular CLI version (8.3.20) is greater than your local version (7.0.7). The local Angular CLI version is used\'', ' Over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. \'Your global Angular CLI version (8.3.20) is greater than your local version (7.0.7). The local Angular CLI version is used\'', ],
        email: 'danetest@gmail.com',
        id: 1
      },
      {
        first_name: 'Linux',
        last_name: 'Jobber',
        content: ['If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.\'Send me email and your fine\'', 'Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.\'Send me email and your fine\''],
        email: 'linuxjobber@gmail.com',
        id: 2
      },
      {
        first_name: 'Noobaid',
        last_name: 'surulere',
        content: ['\'Send me email esktop/ALCWITH GOOGLE-Project/HNG/fasma and your fine\'. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.', ],
        email: 'noobtest@gmail.com',
        id: 3
      },
      {
        first_name: 'Azeem ',
        last_name: 'Animashaun',
        content: ['An NgModule is a class marked by the @NgModule decorator. @NgModule takes a metadata object that describes how to compile a component\'s template and how to create an injector at runtime. It identifies the modules own components, directives, and pipes, making some of', ' It identifies the modules own components, directives, and pipes, making some of. An NgModule is a class marked by the @NgModule decorator. @NgModule takes a metadata object that describes how to compile a component\'s template and how to create an injector at runtime'],
        email: 'azeemtest@gmail.com',
        id: 4
      },
      {
        first_name: 'Boluwatife',
        last_name: 'Test',
        content: ['Send me email and your fine o disable this warning use "ng config -g cli.warnings.versionMismatch ', 'Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'],
        email: 'test@testmail.com',
        id: 5
      },
      {
        first_name: 'Boluwatife',
        last_name: 'Fasugba',
        content: ['So disable this warning use "ng config -g cli.warnings.versionMismatch email and your fine. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.', 'Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'],
        email: 'bolutest@gmail.com',
        id: 6
      },
      {
        first_name: 'Eniayomi',
        last_name: 'Oluwaseyi',
        content: ['Send me o disable this warning use ng config -g cli.warnings.versionMismatch m Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.', 'looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'],
        email: 'ennytest@gmail.com',
        id: 7
      },
    ];
    return sample;
  }

  fetchEmails() {
    this.dataservice.mail_det().subscribe((res) => {
      this.mailList = <djangoMail[]>res['received_emails'];
      this.sent_emails = <[]>res['sent_emails'];

      if (this.mailList.length) {
        const mail = this.mailList[0];
        this.viewMail(mail, 0);
      }
    });
  }

  viewMail(mailItem: djangoMail, _index: number) {
    if (this.mailList.length && typeof (this.mailList[0]) != 'string') {
      const mail = mailItem['MESSAGE-DATE'].map(r => r).reverse();
      const mailer = mailItem.FROM;
      const mailee = mailItem.TO;
      const user_date = mailItem.DATE;

      this.router.navigate(['/mail/', mailer]);
      this.message = '';
      sessionStorage.setItem('mailer', mailer);
      sessionStorage.setItem('mailee', mailee);
      sessionStorage.setItem('user_date', user_date)
      this.userMsg = [];
      mail.forEach(m => {
        this.userMsg.push({
          msg: m[0],
          msgDate: m[1]
        })
      })
      this.mailee = mailee;
      this.mailer = mailer;
      this.user_date = user_date;
      this.selectedIndex = _index;

    }
  }

  notification(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  emailDataToSend() {
    document.getElementById('sentEmailStatus').style.display = 'block'
    let form: any = new FormData()
    form.append('frommail', this.email_from)
    form.append('tomail', this.email_to)
    form.append('subject', this.email_subject)
    form.append('msgb', this.email_message)
    form.append('attach', this.email_attachement)
    this.http.post(this.dataservice.domain_protocol + this.dataservice.f_domain_name + '/mail/', form).subscribe(
      data => {
        document.getElementById('sentEmailStatus').style.display = 'none'
        this.notification('Message sent successfully!', 'Close')
        //console.log(data)
        this.email_to = ''
        this.email_message = ''
        this.email_subject = ''
      }, error => {
        console.log(error)
        document.getElementById('sentEmailStatus').style.display = 'none'
        this.notification('Message sending failed!', 'Close')
      }
    )
  }

  sendToNewEmail() {
    if (this.email_to) {
      if (this.email_subject || this.email_message || this.email_attachement) {
        if (this.email_subject == undefined) {
          this.email_subject = ''
        } else if (this.email_message == undefined) {
          this.email_message = ''
        }
        this.emailDataToSend()
      } else {
        if (confirm('Are you sure you want to send this email without subject and message?')) {
          this.email_subject = ''
          this.email_message = ''
          this.emailDataToSend()
        }
      }
    } else {
      this.notification('Receivers email is required!', 'Okay')
    }
  }

  deleteMessage(email) {
    let deleteForm: any = new FormData()
    deleteForm.append('receiversEmail', this.email_from)
    this.mailList.forEach(msg => {
      for (let index = 0; index < msg['MESSAGE-DATE'].length; index++) {
        if (email.msg == msg['MESSAGE-DATE'][index][0] && email.msgDate == msg['MESSAGE-DATE'][index][1]) {
          let msgToRmv = msg['MESSAGE-DATE'][index]
          msg['MESSAGE-DATE'].splice(msg['MESSAGE-DATE'].indexOf(msgToRmv), 1)
          if (this.userMsg.length == 1) {
            this.mailList.splice(this.mailList.indexOf(msg), 1)
            this.userMsg = []
            this.viewMail(this.mailList[0], 0)
          }
          else{
            this.viewMail(this.mailList[0], 0)
          }
          deleteForm.append('sendersEmail', msg.FROM)
          deleteForm.append('msgDate', msgToRmv[1])
          this.notification('Message Deleted', 'Close')
        }
      }
    })
    this.http.post(this.dataservice.domain_protocol + this.dataservice.f_domain_name + '/delete/mail', deleteForm).subscribe(
      data => {
        // console.log(data)
      }, error => {
        // console.log(error)

      })
  }
}

// tslint:disable-next-line: class-name
export interface djangoMail {
  TO: string;
  FROM: string;
  SUBJECT: string;
  NAME: string;
  DATE: string;
  'MESSAGE-DATE': any[];
}

// we will use for the model of the list of messages for an email
// tslint:disable-next-line: class-name
export interface msg_date {
  msg: string;
  msgDate: string;
}