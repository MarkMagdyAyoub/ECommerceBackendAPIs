import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ProductsComponent } from './components/products/products.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { AccountComponent } from './components/account/account.component';

export const routes: Routes = [
  {path: "" , redirectTo:'homepage' , pathMatch:"full"},
  {path:"homepage" , component:HomepageComponent , title:"Homepage"},
  {path:"register" , component:RegisterComponent , title:"Register"},
  {path:"order" , component:OrderFormComponent , title:"Order"},
  {path:"account" , component:AccountComponent , title:"Account"},
  {path:"login" , component:LoginComponent , title:"Login"},
  {path:"products" , component:ProductsComponent , title:"Products"},
  {path: "**" , component:NotFoundComponent , pathMatch:"full"}
];
