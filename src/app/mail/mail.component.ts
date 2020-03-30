import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/index";
import { DataService } from "./../data.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MzModalModule } from 'ngx-materialize';
import { HttpClient } from '@angular/common/http';
import { MailModel } from "../model/mail-model";



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

  constructor(public dataservice: DataService, private router: Router, private route: ActivatedRoute, private modalModule: MzModalModule, public fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      frommail: [sessionStorage.getItem('email')],
      toemail: [sessionStorage.getItem('mailer')],
      subject: [''],
      messagebody: [''],
      avatar: [null]
    });

    this.sendNewEmailForm = this.fb.group({
      email: [''],
      subject: [''],
      message: [''],
      avatar: [null],
    });

    this.getSubject = this.fb.group({
      subject: ['']
    })

    this.username = sessionStorage.getItem('username');
    this.email = sessionStorage.getItem('email');
    this.mails = this.assignValue();
  }


  ngOnInit() {
    console.log("Testing")
    if (this.route.snapshot.paramMap.get('email')) {
      this.toEmail = this.route.snapshot.paramMap.get('email');
    }
    this.dataservice.mail_det();
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()
  }

  logout() {
    this.dataservice.logout();
  }

  sendToNewEmail(){
    this.message = ''
    var formData: any = new FormData();
    this.toEmail = this.sendNewEmailForm.controls.email.value;
    this.subject = this.sendNewEmailForm.controls.subject.value;
    if (this.toEmail == null || this.sendNewEmailForm.get('message').value == null) {
      return;
    } else {
      this.viewMail('', '', '', '', this.toEmail)
      formData.append("frommail", this.form.get('frommail').value);
      formData.append("tomail", this.toEmail);
      formData.append("subject", this.subject);
      formData.append("msgb", this.sendNewEmailForm.get('message').value);
      formData.append("attach", this.sendNewEmailForm.get('avatar').value);
    }


    this.http.post('http://127.0.0.1:9000/mail/', formData).subscribe(
      data => {
        this.message = 'Email has been sent.'
      },
      err => {
        this.message = 'Email Not sent! Error!';
      }
    );
    this.form.reset();
  }


  sendEmail() {
    this.message = ''
    var formData: any = new FormData();
    if (this.toEmail == null || this.form.get('messagebody').value == null) {
      return;
    } else {
      formData.append("frommail", this.form.get('frommail').value);
      formData.append("tomail", this.form.get('tomail').value);
      formData.append("subject", this.form.get('subject').value);
      formData.append("msgb", this.form.get('messagebody').value);
      formData.append("attach", this.form.get('avatar').value);
    }


    this.http.post(this.dataservice.domain_protocol + this.dataservice.f_domain_name + '/mail/', formData).subscribe(
      data => {
        this.message = 'Email has been sent.'
      },
      err => {
        this.message = 'Email Not sent! Error!';
      }
    );
    this.form.reset();
  }
  assignValue() {
    let sample = [
      {
        first_name: 'Test',
        last_name: 'Ologbo',
        content: ["The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from 'de Finibus Bonorum et Malorum' by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.", "uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. 'Your global Angular CLI version (8.3.20) is greater than your local version (7.0.7). The local Angular CLI version is used"],
        email: 'Test@gmail.com ',
        id: 0
      },
      {
        first_name: 'Oluwaseyi',
        last_name: 'Dane',
        content: [" It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. 'Your global Angular CLI version (8.3.20) is greater than your local version (7.0.7). The local Angular CLI version is used'", " Over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. 'Your global Angular CLI version (8.3.20) is greater than your local version (7.0.7). The local Angular CLI version is used'",],
        email: 'danetest@gmail.com',
        id: 1
      },
      {
        first_name: 'Linux',
        last_name: 'Jobber',
        content: ["If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.'Send me email and your fine'", "Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.'Send me email and your fine'"],
        email: 'linuxjobber@gmail.com',
        id: 2
      },
      {
        first_name: 'Noobaid',
        last_name: 'surulere',
        content: ["'Send me email esktop/ALCWITH GOOGLE-Project/HNG/fasma and your fine'. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet.",],
        email: 'noobtest@gmail.com',
        id: 3
      },
      {
        first_name: 'Azeem ',
        last_name: 'Animashaun',
        content: ["An NgModule is a class marked by the @NgModule decorator. @NgModule takes a metadata object that describes how to compile a component's template and how to create an injector at runtime. It identifies the modules own components, directives, and pipes, making some of", " It identifies the modules own components, directives, and pipes, making some of. An NgModule is a class marked by the @NgModule decorator. @NgModule takes a metadata object that describes how to compile a component's template and how to create an injector at runtime"],
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
    return sample
  }

  viewMail(mail, mailer, mailee, user_date, _index: number) {
    this.router.navigate(['mail/'+ mailer])
    console.log(mail)
    console.log(mailer)
    console.log(user_date)
    this.message = ''
    sessionStorage.setItem('mailer', mailer)
    sessionStorage.setItem('mailee', mailee);
    sessionStorage.setItem('user_date', user_date)
    console.log(sessionStorage.getItem('mailer'))
    this.user_message = mail;
    this.mailee = mailee;
    this.user_date = user_date;
    this.selectedIndex = _index;
  }
}
export interface djangoMail{
  TO: string,
  FROM: string,
  SUBJECT: string,
  NAME: string,
  "MESSAGE-DATE": any[]
}