
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import {MailComponent} from "./mail/mail.component";
import { SentemailsComponent } from './sentemails/sentemails.component'



const routes: Routes = [
  { path: '', redirectTo: '/mail', pathMatch: 'full'},
  { path: 'mail', component: MailComponent},
  // { path: 'mail', component: MailComponent, canActivate: [AuthGuard]},
  { path: 'mail/:email', component: MailComponent},
  // { path: 'mail/:email', component: MailComponent, canActivate: [AuthGuard] },
  { path: 'mails/sent', component: SentemailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
