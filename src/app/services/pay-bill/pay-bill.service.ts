import { DashboardService } from './../dashboard/dashboard.service';
import { AuthService } from "./../authService/auth.service";
import { HelpersService } from "./../helpers/helpers.service";
import { Injectable } from "@angular/core";
import { DataService } from "../data.service";
import { ToastrService } from "ngx-toastr";
import { ManageaccountService } from "../manageaccount/manageaccount.service";

@Injectable({
  providedIn: "root"
})
export class PayBillService {
  constructor(
    private _data: DataService,
    private AuthService: AuthService,
    private helpers: HelpersService,
    private toaster: ToastrService,
    private userAccounts:ManageaccountService,
    private dashboard:DashboardService
  ) {}
  checkIfAccountIsPrepaid(accNumber,callback) {
    this.dashboard.getAccountDetails(accNumber,(response)=>{
      callback(response)
   });
  }  
  
  translate(string: string): string {
    return this.helpers.translate(string);
  }
  getAccountToken() {
    return this.helpers.getLocalStoragData("accountToken");
  }
  getCurrentUser() {
    return this.AuthService.getCurrentUser();
  }
  isLoggedIn() {
    return this.AuthService.isLoggedIn();
  }
  getBillAccountDetails(body) {
   // let billPayEnquiry="users/billPayEnquiry"; actual amount
   let billPayEnquiry="users/billPayEnquiryDummy";

    return this._data.getAll(billPayEnquiry, body, {}, "POST");
  }
  getAccounts() {
    return this.userAccounts.getAccount("");
  }
  getPaymentChecksm(accountNumber,amount=0,type="postPaid"){
    accountNumber={"accountToken":btoa(accountNumber)};
    accountNumber["amount"]=amount
    //let paytmCheckout="users/paytmCheckout";
    let paytmCheckout="users/paytmCheckoutDummy";
    if(type == "prePaid"){
      paytmCheckout="users/paytmCheckout";
    }
    return this._data.getAll(paytmCheckout,accountNumber,{},"POST");
  }
  prompt(flag: string, msg: string) {
    var translatedMsg = this.translate(msg);
    switch (flag) {
      case "success":
        this.toaster.success(translatedMsg);
        break;
      case "warning":
        this.toaster.warning(translatedMsg);
        break;
      case "error":
        this.toaster.error(translatedMsg);
        break;
      default:
        this.toaster.error("Something went wrong!");
        break;
    }
  }
  getTransectionData(url){
    return this._data.getAll(url,{},{},"POST",false);
  }
}
