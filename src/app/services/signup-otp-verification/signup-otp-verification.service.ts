import { DataService } from '../data.service';
import { Injectable } from '@angular/core';
import { HelpersService } from './../helpers/helpers.service';
import {LoginService} from '../login/login.service';
@Injectable()
export class SignupOtpVerificationService{
  constructor(private DataService:DataService,private helpers:HelpersService,private LoginService:LoginService) {}
   
  verifyOtp(api_url,data_object){
   return this.DataService.create(api_url,data_object); 
   }

}

