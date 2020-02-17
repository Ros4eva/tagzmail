import {Injectable} from '@angular/core';
import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import {AsyncPipe} from "@angular/common";
import has = Reflect.has;

  
@Injectable()
export class AuthGuard implements CanActivate {
  _hash:string;

  constructor(private dataservice: DataService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (DataService.islogin()) {
      return true;
    }
    
    else {  

      const hash = route.queryParamMap.get('hash');
      if(hash){
        this.dataservice.sessionSet(hash)     
      } 
      else {
        alert("Session expired, redirecting back to linuxjobber");
        window.location.replace('http://127.0.0.1:8000')
        return false;
      }
    }
  }
}
