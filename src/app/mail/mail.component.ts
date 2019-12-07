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

  constructor(private dataservice: DataService) {
  	this.username=sessionStorage.getItem('username');
  }

  ngOnInit() {
  }

  logout(){
    this.dataservice.logout(); 
  }  

}
