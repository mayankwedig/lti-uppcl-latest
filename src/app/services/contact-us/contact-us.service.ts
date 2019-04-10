import { HomeService } from './../home/home.service';
import { Injectable } from '@angular/core';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService {

  constructor(private _data:DataService,private homeService:HomeService) { }
  getImportantLink(){
    return this.homeService.getImportantLink();
  }
  getContactUsContent(){
    return this._data.getAll("users/staticPage",{slug: "contact-us"},{},"POST");
  }
}
