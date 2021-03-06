import { DashboardService } from './../services/dashboard/dashboard.service';
import { NotificationsService } from './../services/notifications/notifications.service';
import { HelpersService } from './../services/helpers/helpers.service';
import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { AuthService } from "../services/authService/auth.service";
import { DataService } from '../services/data.service';
require("../../../node_modules/moment/min/moment.min.js");
import { TranslationService } from "../services/translation/translation.service";
declare var moment: any;
declare var $: any;
import { environment } from "./../../environments/environment";
@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})

export class NotificationListComponent implements OnInit {

  notificationLoder:boolean=false
  notifications:any=[];
  notificationfound:boolean=false
  isnotificationFound:boolean=false;
  accountNumber:any="";
  dispString:any="";
  constructor(
    public auth:AuthService,
    public dataservice:DataService,
    private helpers:HelpersService,
    private notificationsService:NotificationsService,
    private DashboardService:DashboardService,
    private translationServices: TranslationService

  ) { }
  AlertIconUrl=environment.alertIconUrl;
  ngOnInit() {
  let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
    let accountTokenInfo = accountToken.split(":");
    this.accountNumber = accountTokenInfo[1]; //account Number
    this.dispString =  this.translationServices.translate("accountnumber")+" ( " + this.accountNumber + " ) ";

    this.getAllNotifications();
    this.getAlertData();
  };
  getNotificationData(type){
    if(this.helpers.getLocalStoragData("notifications") != null){
      let notify=JSON.parse(this.helpers.getLocalStoragData("notifications"));
      if(typeof notify[type] != 'undefined'){
        return notify[type];
      }
      
     }else{
      return null;
     }
  }
  getAllNotifications(){
    var limited=false;
    this.notificationsService.getNotifications(limited).subscribe(
     (response: any) => {
       var res = response;
       this.notificationLoder = false;
       if (res.authCode) {
         if (res.authCode == "200" && res.status == true) {
           this.notifications = res.data_params;
           this.isnotificationFound=true;
         } else {
           this.notifications = [];
           this.isnotificationFound=false;
         }
       }
     },
     (error: AppError) => {
      this.isnotificationFound=false; 
      this.notificationLoder = false;
       this.notifications = [];
       if (error instanceof BadInput) {
       } else {
         throw error;
       }
     }
   );
  }
  alertData = [];
  alertDataLoader: boolean = false;
  isAlertDataFound: boolean = false;
  getAlertData() {
    this.alertDataLoader = true;
    this.DashboardService.getAlertData(this.accountNumber).subscribe(
      (response: any) => {
        var res = response;
        this.alertDataLoader = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.alertData = res.data_params;
            for(let i = 0; i < this.alertData.length; i++){
              this.alertData[i]["icon_img"]=null;
              this.alertData[i]["desc"]=null;
              let NotificationData=this.getNotificationData(this.alertData[i].alertText);
              if(NotificationData != null){
                this.alertData[i]["icon_img"]=NotificationData.icon_img;
                this.alertData[i]["desc"]=NotificationData.desc;
              }
            }
            this.isAlertDataFound = true;
          } else {
            this.isAlertDataFound = false;
            this.alertData = [];
          }
        }
      },
      (error: AppError) => {
        this.isAlertDataFound = false;
        this.alertDataLoader = false;
        this.alertData = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
  
  }









  
  

 

  



