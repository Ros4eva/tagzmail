import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/index";
import {DataService} from "./../data.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MzModalModule } from 'ngx-materialize';
import { HttpClient } from '@angular/common/http';


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

  constructor(private dataservice: DataService, private modalModule: MzModalModule, public fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      frommail: [sessionStorage.getItem('email')],
      toemail: [''],
      subject: [''],
      messagebody: [''],
      avatar: [null]
    })
  	this.username=sessionStorage.getItem('username');
  	this.email=sessionStorage.getItem('email');
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

    this.http.post('http://localhost:5000/mail/', formData).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    )


  }

}
