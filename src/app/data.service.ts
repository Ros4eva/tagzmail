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

  private headers: HttpHeaders = new HttpHeaders();


  public httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };
  public authOptions;
  private required:boolean = false;
  private uploaded:boolean = true;


  constructor(private http: HttpClient, private router: Router,
              private route: ActivatedRoute,location:Location,
             ) {

  }


  static islogin() {
      return !!sessionStorage.getItem('token');
  }

  logout() {
    sessionStorage.clear()
    window.location.replace('http://127.0.0.1:8000')
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

