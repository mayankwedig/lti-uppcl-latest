import { HelpersService } from './../helpers/helpers.service';
import { DataService } from './../data.service';
import { Injectable } from '@angular/core';
import { AuthService } from '../authService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsService {

  constructor(private helpers:HelpersService,private data:DataService,private auth:AuthService,private helper:HelpersService) { }
  getSiteSettingsAPI(){
    return this.data.getAll("users/siteSetting","",{},"GET");
  }
  setSiteSettingsSession(data_params){
    this.helpers.setLocalStoragData("siteSettings",JSON.stringify(data_params));
  }
  getSiteSettings(){
    if(this.helpers.getLocalStoragData("siteSettings") != null){
      return JSON.parse(this.helpers.getLocalStoragData("siteSettings"));
    }else{
      return null;
    }
  }
}
