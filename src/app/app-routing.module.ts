import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HouseComponent } from './pages/house/house.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GestionarComponent } from './pages/gestionar/gestionar.component';
import { ChatsComponent } from './pages/chats/chats.component';
import { UsersComponent } from './pages/users/users.component';

import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from "@angular/fire/auth-guard";

const routes: Routes = [
  {
    path: 'home', component: HomeComponent,
    children: [
      { path: '', component: HouseComponent },
      { path: 'dashboard', component: DashboardComponent, ...canActivate(() => redirectUnauthorizedTo(['home']))},
      { path: 'gestionar', component: GestionarComponent, ...canActivate(() => redirectUnauthorizedTo(['home']))},
      { path: 'chats', component: ChatsComponent, ...canActivate(() => redirectUnauthorizedTo(['home']))},
      { path: 'users', component: UsersComponent, ...canActivate(() => redirectUnauthorizedTo(['home']))},
    ]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'home'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {routes: any}
