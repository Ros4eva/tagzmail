import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute,  Router} from '@angular/router';
import {Location} from "@angular/common";
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public login_username;
  public login_password;
  public createuser_email;
  public createuser_password;
  public createuser_username;
  public username;
  public id;
  public email;
  public users;

  public message;

  public from_email;
  public message_body;
  public to_email;
  public email_subject;

  private headers: HttpHeaders = new HttpHeaders();


  public httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  public authOptions;
  private required:boolean = false;
  private uploaded:boolean = true;
  fileData: File = null;

  constructor(private http: HttpClient, private router: Router,
              private route: ActivatedRoute,location:Location,
             ) {

  }

  fileProgress(fileInput: any) {
    this.fileData = <File>fileInput.target.files[0];
  } 


  static islogin() {
      return !!sessionStorage.getItem('token');
  }

  logout() {
    sessionStorage.clear()
    window.location.replace('http://127.0.0.1:8000')
  }
 
  sendEmail()
  {
    console.log(this.message_body)
    console.log(this.from_email)
    console.log(this.to_email)
    console.log(this.email_subject)

    this.from_email = sessionStorage.getItem('email');
    this.http.post('http://127.0.0.1:5000' + '/mail/', JSON.stringify({'frommail': this.from_email, 'tomail': this.to_email, 'subject': this.email_subject, 'msgb':this.message_body}), this.httpOptions).subscribe(
        data => {
            this.message = 'Email has been sent.'
            this.message_body = '';
            this.from_email = '';
            this.to_email = '';
            this.email_subject = '';
        },
        err => {
            this.message = 'Email Not sent! Error!';
            console.error(err);
            this.message_body = '';
            this.from_email = '';
            this.to_email = '';
            this.email_subject = '';
        }
    );
  }  

  sessionSet(token:string)  {
    this.http.post('http://127.0.0.1:8000' + '/sso_api/confirm_key/' + 3,JSON.stringify({'token':token}),this.httpOptions)
      .subscribe(data=>{
      sessionStorage.clear();
      sessionStorage.setItem('username', data['username']);
      sessionStorage.setItem('token', data['token']);
      sessionStorage.setItem('role', data['role']);
      sessionStorage.setItem('user_id', data['id']);
      sessionStorage.setItem('email', data['email']);


      
      this.router.navigate(['/mail'])
      return true;
      
    },error => console.log('oops', error))
  }
}

