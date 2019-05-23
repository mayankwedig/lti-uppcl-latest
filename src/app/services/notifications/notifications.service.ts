import { HelpersService } from './../helpers/helpers.service';
import { Injectable } from '@angular/core';
import { DataService } from "./../data.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private dataService:DataService, private help:HelpersService) { }
  getNotifications(limited){
    var notificationAPI="users/getNotificationWithLimit";
    if(!limited){
      notificationAPI="users/getNotificationWithoutLimit"
    }
    return this.dataService.getAll(
      notificationAPI,
      '',
      '',
      "POST"
    );
  }
  setNotifications(type){
    if(this.help.getLocalStoragData("notifications") != null){
      let notify=JSON.parse(this.help.getLocalStoragData("notifications"));
        console.log(notify[type]);
     }else{
      return null;
     }
  }
}