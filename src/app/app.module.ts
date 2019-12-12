import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {DataService} from './data.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiComponent } from './api/api.component';
import { MailComponent } from './mail/mail.component';
import { HttpClientModule } from '@angular/common/http';
import { Router,RouterModule } from '@angular/router';
import {Location} from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MzButtonModule, MzModalModule } from 'ngx-materialize';
import { CommonModule } from '@angular/common';  


@NgModule({
  declarations: [
    AppComponent,
    ApiComponent,
    MailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    MzButtonModule,
    MzModalModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [DataService,Location],
  bootstrap: [AppComponent]
})
export class AppModule { }
