import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WelcomeComponent } from './welcome/welcome.component';


const routes: Routes = [
  {
    path:'',
    pathMatch:'full',
    component: WelcomeComponent
  },
  {
    path:'home',
    pathMatch:'full',
    component: HomeComponent
  },
  {
    path:'login',
    pathMatch:'full',
    component: LoginComponent
  },
  {
    path:'register',
    pathMatch:'full',
    component: RegisterComponent
  },
  {
    path:'dashboard',
    pathMatch:'full',
    component: DashboardComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
