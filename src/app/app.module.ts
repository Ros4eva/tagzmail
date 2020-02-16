import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {DataService} from './data.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiComponent } from './api/api.component';
import { MailPlatformModule } from './mail-platform/mail-platform.module';
import { HttpClientModule } from '@angular/common/http';
import {Location} from "@angular/common";
import { CommonModule } from '@angular/common';
import { MailPipe } from './mail/mail.pipe';
import { TruncPipe } from './trunc.pipe';  


@NgModule({
  declarations: [
    AppComponent,
    ApiComponent,
    MailPipe,
    TruncPipe,
  ],
  imports: [
    BrowserModule,
    MailPlatformModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
  ],
  providers: [DataService,Location],
  bootstrap: [AppComponent]
})
export class AppModule { }
