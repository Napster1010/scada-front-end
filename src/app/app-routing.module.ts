import { ViewCurrentComponent } from './view-current/view-current.component';
import { AuthServiceGuard } from './guards/auth-service.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperateRelayComponent } from './operate-relay/operate-relay.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthServiceGuard], children : [
    {path: '', component: OperateRelayComponent},
    {path: 'view-current', component: ViewCurrentComponent},
    {path: 'operate-relay', component: OperateRelayComponent}
  ]},
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
