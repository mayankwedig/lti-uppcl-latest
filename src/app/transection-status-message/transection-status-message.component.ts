import { AuthService } from './../services/authService/auth.service';
import { HelpersService } from './../services/helpers/helpers.service';
import { ActivatedRoute,Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-transection-status-message',
  templateUrl: './transection-status-message.component.html',
  styleUrls: ['./transection-status-message.component.css']
})
export class TransectionStatusMessageComponent implements OnInit {

  constructor(private _auth:AuthService, private helpersService:HelpersService,private activeRoute:ActivatedRoute, private Route :Router) { }
  /* error_code=100;
  status=false;
  message=""; */
  translate(msg:string):string{
    return this.helpersService.translate(msg);
  }
  isLoggedIn(){
    return this._auth.isLoggedIn();
  }
  msgFlag="error";
  viewTransectionDetails:any=null;
  msgDispay=this.translate("Something went wrong,Please try again later");
  ngOnInit() {
    if(!this.activeRoute.snapshot.queryParams.authCode){
        this.redirectUser("/");
    }else{
      let error_code=this.activeRoute.snapshot.queryParams.authCode;
      let status=this.activeRoute.snapshot.queryParams.status;
      let msg=this.activeRoute.snapshot.queryParams.msg;
      let token=atob(this.activeRoute.snapshot.queryParams.token);
      let tansectionDetails=JSON.parse(token);
      this.viewTransectionDetails=tansectionDetails;
      if(error_code == 200 && status == 'true'){
        this.msgFlag="success";
        this.msgDispay=this.translate("Your payment has been processed successfully");
      }else{
        if(tansectionDetails == null){
          this.viewTransectionDetails=null
          this.msgFlag="error";
          this.msgDispay=this.translate("Something went wrong, please try again later.");    
        }else{
          if(this.viewTransectionDetails.STATUS == "TXN_FAILURE"){
            this.msgFlag="error";
            this.msgDispay=this.translate(msg);
          }else if(this.viewTransectionDetails.STATUS == "PENDING"){
            this.msgFlag="warning";
            this.msgDispay=this.translate(msg);
          }else if(this.viewTransectionDetails.STATUS == "TXN_SUCCESS"){
            this.msgFlag="warning";
            this.msgDispay=this.translate("Something went wrong, please contact with our customer support system.");
          }else{
            this.msgFlag="error";
            this.msgDispay=this.translate(msg);
          }
        }
      }
     
    }
    
  }
  redirectUser(path){
    this.Route.navigate([path]);
  }
}
