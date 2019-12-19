import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/index";
import {DataService} from "./../data.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MzModalModule } from 'ngx-materialize';
import { HttpClient } from '@angular/common/http';
import {MailModel} from "../model/mail-model";


declare var $: any;

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {
  form: FormGroup;
  public username:any;
  public email:any;
  public message;
  public from;
  // public mails:['op', 'you', 'uio'];
  public mails:MailModel[];
  // public mails:[
  //   {
  //     first_name: 'Test',
  //   last_name: 'Ologbo',
  //   content: 'Send me email and your fine',
  //   email: 'Test@gmail.com '
  //   },
  //   {
  //     first_name: 'Oluwaseyi',
  //   last_name: 'Dane',
  //   content: 'Your global Angular CLI version (8.3.20) is greater than your local version (7.0.7). The local Angular CLI version is used',
  //   email: 'danetest@gmail.com'
  //   },
  //   {
  //     first_name: 'Linux',
  //   last_name: 'Jobber',
  //   content: 'Send me email and your fine',
  //   email: 'linuxjobber@gmail.com'
  //   },
  //   {
  //     first_name: 'Noobaid',
  //   last_name: 'surulere',
  //   content: 'Send me email esktop/ALCWITH GOOGLE-Project/HNG/fasma and your fine',
  //   email: 'noobtest@gmail.com'
  //   },
  //   {
  //     first_name: 'Azeem ',
  //   last_name: 'Animashaun',
  //   content: 'Send me your fine',
  //   email: 'azeemtest@gmail.com'
  //   },
  //   {
  //     first_name: 'Boluwatife',
  //   last_name: 'Test',
  //   content: 'Send me email and your fine o disable this warning use "ng config -g cli.warnings.versionMismatch ',
  //   email: 'test@testmail.com'
  //   },
  //   {
  //     first_name: 'Boluwatife',
  //   last_name: 'Fasugba',
  //   content: 'So disable this warning use "ng config -g cli.warnings.versionMismatch email and your fine',
  //   email: 'bolutest@gmail.com'
  //   },
  //   {
  //     first_name: 'Eniayomi',
  //   last_name: 'Oluwaseyi',
  //   content: 'Send me o disable this warning use ng config -g cli.warnings.versionMismatch m',
  //   email: 'ennytest@gmail.com'
  //   },
  // ];

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

  constructor(public dataservice: DataService, private modalModule: MzModalModule, public fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      frommail: [sessionStorage.getItem('email')],
      toemail: [''],
      subject: [''],
      messagebody: [''],
      avatar: [null]
    })
  	this.username=sessionStorage.getItem('username');
    this.email=sessionStorage.getItem('email');
    this.mails= this.assignValue();
  }


  ngOnInit() {
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').updateValueAndValidity()
  }

  logout(){
    this.dataservice.logout(); 
  }  


  sendEmail()
  {
    var formData: any = new FormData();
    console.log(this.form.get('toemail').value)
    console.log(this.form.get('frommail').value)
    console.log(this.form.get('subject').value)
    console.log(this.form.get('messagebody').value)
    console.log(this.form.get('avatar').value)
    formData.append("frommail", this.form.get('frommail').value);
    formData.append("tomail", this.form.get('toemail').value);
    formData.append("subject", this.form.get('subject').value);
    formData.append("msgb", this.form.get('messagebody').value);
    formData.append("attach", this.form.get('avatar').value);

    this.http.post('http://127.0.0.1:9000/mail/', formData).subscribe(
      data => {
            this.message = 'Email has been sent.'
      },
      err => {
            this.message = 'Email Not sent! Error!';
            }
    );


  }

  assignValue(){
    let sample =[
      {
        first_name: 'Test',
      last_name: 'Ologbo',
      content: 'Send me email and your fine',
      email: 'Test@gmail.com ',
      id:0
      },
      {
        first_name: 'Oluwaseyi',
      last_name: 'Dane',
      content: 'Your global Angular CLI version (8.3.20) is greater than your local version (7.0.7). The local Angular CLI version is used',
      email: 'danetest@gmail.com',
      id:1
      },
      {
        first_name: 'Linux',
      last_name: 'Jobber',
      content: 'Send me email and your fine',
      email: 'linuxjobber@gmail.com',
      id:2
      },
      {
        first_name: 'Noobaid',
      last_name: 'surulere',
      content: 'Send me email esktop/ALCWITH GOOGLE-Project/HNG/fasma and your fine',
      email: 'noobtest@gmail.com',
      id:3
      },
      {
        first_name: 'Azeem ',
      last_name: 'Animashaun',
      content: 'Send me your fine',
      email: 'azeemtest@gmail.com',
      id:4
      },
      {
        first_name: 'Boluwatife',
      last_name: 'Test',
      content: 'Send me email and your fine o disable this warning use "ng config -g cli.warnings.versionMismatch ',
      email: 'test@testmail.com',
      id:5
      },
      {
        first_name: 'Boluwatife',
      last_name: 'Fasugba',
      content: 'So disable this warning use "ng config -g cli.warnings.versionMismatch email and your fine',
      email: 'bolutest@gmail.com',
      id:6
      },
      {
        first_name: 'Eniayomi',
      last_name: 'Oluwaseyi',
      content: 'Send me o disable this warning use ng config -g cli.warnings.versionMismatch m',
      email: 'ennytest@gmail.com',
      id:7
      },
    ];
    return sample
  }

  viewMail(tag){

      this.message =this.mails[tag.path[4].id].content
      this.from =this.mails[tag.path[4].id].last_name
      // console.log(tag.path[4].id)
      return console.log('clicked')
   
  }

}
