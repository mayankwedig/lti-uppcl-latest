import { AuthService } from './../authService/auth.service';
import { DataService } from '../data.service';
import { Injectable } from '@angular/core';
import { HelpersService } from './../helpers/helpers.service';
@Injectable()
export class LoginService{
  constructor(private DataService:DataService,private helpers:HelpersService,private auth:AuthService) {}
   loginUser(api_url,data_object){
    return this.DataService.create(api_url,data_object);
   }
   forgotPassService(api_url,data_object){
    return this.DataService.create(api_url,data_object); 
   }
   setLoginData(token){
   
    this.helpers.setLocalStoragData('token',token);
    
   }
   setOtpVerificationSession(data){
    this.helpers.setLocalStoragData('otpVerification',data);
   }
   getOtpVerificationSession(){ 
    let token=this.helpers.getLocalStoragData('otpVerification');
    return (!token) ? null:true;
    //if(!token) return null;
   }
   clearOtpSession(){
     this.helpers.clearLocalStorateData('otpVerification');
   }
    getUserData(){
      return this.auth.getCurrentUser();
    } 
    getUsersQuetion(userName:String){
      var sdapiUrl="users/userQuestionList"
      var body={"userName":userName}
      return this.DataService.getAll(sdapiUrl,body,{},"POST");
     
     }  
}

