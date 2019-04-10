import { HelpersService } from './../helpers/helpers.service';
import { DataService } from './../data.service';
import { Injectable } from '@angular/core';
import { AuthService } from '../authService/auth.service';



@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private data:DataService,private auth:AuthService,private helper:HelpersService) { }
  getProfileUrl="users/getProfile";
  updateProfileUrl="users/updateProfile";
  updateProfileImageUrl="users/updateProfileImage";
  profileUpdateOTPAPI='users/profileUpdateOTP';
  getProfile(accountNumber){
    var currentUser=this.auth.getCurrentUser();
    var body={"profileToken":btoa(currentUser.userId),"accountToken":btoa(accountNumber)};
   return this.data.getAll(this.getProfileUrl,body,this.helper.setHeaderData(),"POST");
  }
  saveProfile(data_object){
    var currentUser=this.auth.getCurrentUser();
    data_object.profileToken=btoa(currentUser.userId);
    return this.data.create(this.updateProfileUrl,data_object,this.helper.setHeaderData());
  }
  saveProfileIamge(data_object){
    var currentUser=this.auth.getCurrentUser();
    data_object["profileToken"]=btoa(currentUser.userId);
    return this.data.create(this.updateProfileImageUrl,data_object,this.helper.setHeaderData());
  }
  verifyMobileNumber(data_object){
    var currentUser=this.auth.getCurrentUser();
    var body={"profileToken":btoa(currentUser.userId),"accountToken":btoa(data_object.accountNumber),"mobile":data_object.mobileNumber};
    return this.data.create(this.profileUpdateOTPAPI,body,this.helper.setHeaderData());
  }
  verifyOtp(dataObject){
    return this.data.create("users/otpVerifyProfile",dataObject,this.helper.setHeaderData());
  }
  verifyPassword(dataObject){
    var currentUser=this.auth.getCurrentUser();
    dataObject["profileToken"]=btoa(currentUser.userId);
    return this.data.create("users/matchDetails",dataObject,this.helper.setHeaderData());
  }
  getSiteLogo(){
    return this.data.getAll("users/siteSetting","",{},"GET");
  }
}
