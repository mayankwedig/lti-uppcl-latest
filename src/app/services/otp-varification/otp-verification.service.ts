import { DataService } from '../data.service';
import { Injectable } from '@angular/core';
import { HelpersService } from './../helpers/helpers.service';
import {LoginService} from '../login/login.service';
@Injectable()
export class OtpVerificationService{
  constructor(private DataService:DataService,private helpers:HelpersService,private LoginService:LoginService) {}
   
  verifyOtp(api_url,data_object){
    var otpVerifyToken=data_object.otpToken;
    var data={"otpVerifyToken":otpVerifyToken,"verifyOtp":data_object.otp};
    return this.DataService.create(api_url,data); 
   }
  clearOtpSessionData(){
    this.LoginService.clearOtpSession();
  } 
  getOtpVerificationSession(){ 
    let token=this.helpers.getLocalStoragData('otpVerification');
    return (!token) ? null:token;
    //if(!token) return null;
   }  
   changePassSerive(api_url,data_object){
    return this.DataService.create(api_url,data_object); 
   }
}

