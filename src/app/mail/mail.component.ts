import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/index";
import {DataService} from "./../data.service";

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {

  public username:any;
  public email:any;

  constructor(private dataservice: DataService) {
  	this.username=sessionStorage.getItem('username');
  	this.email=sessionStorage.getItem('email');
  }

  ngOnInit() {
  }

  logout(){
    this.dataservice.logout(); 
  }  

}
