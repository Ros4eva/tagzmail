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
import { TestComponent } from './test/test.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module'
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SentemailsComponent } from './sentemails/sentemails.component';


@NgModule({
  declarations: [
    AppComponent,
    ApiComponent,
    TestComponent,
    SentemailsComponent,
  ],
  imports: [
    BrowserModule,
    MailPlatformModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [DataService,Location],
  bootstrap: [AppComponent]
})
export class AppModule { }
