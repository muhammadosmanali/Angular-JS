import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthComponent} from './auth/auth.component';
import {AuthGuard} from './auth/auth.guard';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomePageComponent} from './dashboard/home-page/home-page.component';
import {ImageAnalysisComponent} from './dashboard/image-analysis/image-analysis.component';


const routes: Routes = [
  {path: '', component: HomeComponent,},
  {path: 'auth', component: AuthComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], children: [
      {path: '', component: HomePageComponent},
      {path: 'image-analysis', component: ImageAnalysisComponent}
    ]},
  {path: 'not-found', component: PageNotFoundComponent},
  {path: '**', redirectTo: '/not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
