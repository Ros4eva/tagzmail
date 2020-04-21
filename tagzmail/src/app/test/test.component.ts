import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  user_email: string;
  user_password: any;
  domain_protocol: any = 'https://';
  domain_name: any = 'live.linuxjobber.com';

  public httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  login() {
    console.log(this.user_email, this.user_password)
    this.http.post(this.domain_protocol + this.domain_name + '/scrum/api-token-auth/', JSON.stringify({ 'email': this.user_email, 'password': this.user_password}), this.httpOptions).subscribe(
      data => {
        console.log(data)
      }, error => {
        console.log(error)
      }
    )
  }

}
