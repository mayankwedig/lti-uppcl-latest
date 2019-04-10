import { Injectable } from '@angular/core';
import { DataService } from "./../data.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private dataService:DataService) { }
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
}
