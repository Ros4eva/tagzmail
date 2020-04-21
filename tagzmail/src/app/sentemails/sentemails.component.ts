import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-sentemails',
  templateUrl: './sentemails.component.html',
  styleUrls: ['./sentemails.component.css']
})
export class SentemailsComponent implements OnInit {
  sent_emails: [] = [];
  messageTime: any;


  constructor(private dataservice: DataService) { }

  ngOnInit() {
    this.fetchEmails()
  }

  fetchEmails() {
    this.dataservice.mail_det().subscribe((res) => {
      this.sent_emails = <[]>res['sent_emails'];
    });
  }

  showEmail(to, sub, msg, time) {
    document.getElementById('sentToBox').innerHTML = to;
    document.getElementById('subjectBox').innerHTML = sub;
    document.getElementById('messageBox').innerHTML = msg;
    document.getElementById('showMessageField').style.display = 'block';
    this.messageTime = time
  }

}
