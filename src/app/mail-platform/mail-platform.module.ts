import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MzButtonModule, MzModalModule } from 'ngx-materialize';
import { MailComponent } from '../mail/mail.component';

@NgModule({
  declarations: [
    MailComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MzButtonModule,
    MzModalModule,
    ReactiveFormsModule,
  ],
  exports: [
    FormsModule,
    MzButtonModule,
    MzModalModule,
    ReactiveFormsModule,
    MailComponent
  ]
})
export class MailPlatformModule { }
