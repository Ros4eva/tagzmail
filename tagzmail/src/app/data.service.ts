import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute,  Router} from '@angular/router';
import {Location} from "@angular/common";
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  public f_domain_name = '127.0.0.1:8000';
  public l_domain_name = '127.0.0.1:8000';
  public domain_protocol = 'http://';



  public login_username;
  public login_password;
  public createuser_email;
  public createuser_password;
  public createuser_username;
  public username;
  public id;
  public email;
  public users;
  public staff_email;
  public DATE;
  public TO;
  public FROM;
  public SUBJECT;
  public NAME;
  public projects;
  public det;
  public message;
  public data: any = []
  public from_email;
  public message_body;
  public to_email;
  public email_subject;
  public MESSAGE_DATE;
  public MESSAGE;

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

  sessionSet(token:string)  {
    this.http.post(this.domain_protocol + this.l_domain_name + '/sso_api/confirm_key/' + 3, JSON.stringify({'token':token}),this.httpOptions)
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

  mail_det() {
    this.message = 'Welcome!';
    this.staff_email=sessionStorage.getItem('email');
    return this.http.get(this.domain_protocol + this.f_domain_name+'/api/v1.0/get_user_detail/?id='+this.staff_email);
  }
}

