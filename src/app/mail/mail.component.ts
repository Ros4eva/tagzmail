import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/index";
import {DataService} from "./../data.service";
import { MzModalModule } from 'ngx-materialize';



declare var $: any;

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {

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

  constructor(private dataservice: DataService, private modalModule: MzModalModule) {
  	this.username=sessionStorage.getItem('username');
  	this.email=sessionStorage.getItem('email');
  }

  ngOnInit() {
  }

  logout(){
    this.dataservice.logout(); 
  }  

  sendEmail()
  {
    this.dataservice.sendEmail();  
  }  

  

}
