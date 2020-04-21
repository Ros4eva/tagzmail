import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {Observable, of, Subject} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  CurrentClasses = [];
  private tt;
  private sharedTopic;
  public CurrentTopics = [];
  private allTopics = new Subject();
  _allTopics$ = this.allTopics.asObservable();
  private _data = new Subject();
  data$ = this._data.asObservable();
  private _users = new Subject();
  users$ = this._users.asObservable();


  private headers: HttpHeaders = new HttpHeaders();
  private fileheaders: HttpHeaders = new HttpHeaders();

  constructor(private httpClient: HttpClient, route: ActivatedRoute) {
    this.headers = this.headers.append('Accept', 'application/json');
    this.headers = this.headers.append('Authorization', 'Token ' + sessionStorage.getItem('token'));
    this.fileheaders = this.fileheaders.append('Authorization', 'Token ' + sessionStorage.getItem('token'));
  }

  refreshToken() {

    this.headers = new HttpHeaders();
    this.fileheaders = new HttpHeaders();
    this.headers = this.headers.append('Accept', 'application/json');
    this.headers = this.headers.append('Authorization', 'Token ' + sessionStorage.getItem('token'));
    this.fileheaders = this.fileheaders.append('Authorization', 'Token ' + sessionStorage.getItem('token'));

  }
}  