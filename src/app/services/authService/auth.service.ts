import { HelpersService } from './../helpers/helpers.service';
import { Injectable } from '@angular/core';
import  {Router} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private JwtHelper = new JwtHelperService();
  private Helpers =new HelpersService();
  constructor(private router:Router) { }
  logout(){
    
    this.Helpers.clearLocalStorateData('accountToken');
    this.Helpers.clearLocalStorateData('token');
    this.router.navigate(['/login']);
  }
  isLoggedIn(){
    let token = this.Helpers.getLocalStoragData('token');
    if(!token){
      return false;
    }else{
      return this.JwtHelper.isTokenExpired(token);
    }
  }
  isAccountNumberValidated(){
    let isAccountNumberValid=this.Helpers.getLocalStoragData('isAccountNumberValid');
    if(isAccountNumberValid != 'true' || !isAccountNumberValid){
      return false;
    }else{
      return true;
    }
  }
  ClearIsVerifiedAccountNumber(){
    this.Helpers.clearLocalStorateData('isAccountNumberValid');
    this.Helpers.clearLocalStorateData('verifiedAccountNumber');
    
  }
  getCurrentUser(){
    let token=this.Helpers.getLocalStoragData('token');
    if(!token) return null;

    return this.JwtHelper.decodeToken(token);
  }
}
