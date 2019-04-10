import { HelpersService } from './../helpers/helpers.service';
import { DataService } from './../data.service';
import { Injectable } from '@angular/core';
import { AuthService } from '../authService/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ManageaccountService {
  constructor(private data:DataService,private auth:AuthService,private helper:HelpersService) { }
  manageAccountListeUrl="users/manageAccountList";
  removeAccountUrl="users/removeAccount";
  updateBillingType="users/updateBillingType";
  addAccountAPI="users/addAccount";
  getAccount(search){
    var currentUser=this.auth.getCurrentUser();
    var body={"profileToken":btoa(currentUser.userId),"searchKeyWord":search};
   return this.data.getAll(this.manageAccountListeUrl,body,this.helper.setHeaderData(),"POST");
  }
  deleteAccount(delectAccountData){
    var currentUser=this.auth.getCurrentUser();
    delectAccountData["profileToken"]=btoa(currentUser.userId);
    return this.data.getAll(this.removeAccountUrl,delectAccountData,this.helper.setHeaderData(),"POST"); 
  }
  changeSubscribtion(updSubsData){
    var currentUser=this.auth.getCurrentUser();
    updSubsData["profileToken"]=btoa(currentUser.userId);
    return this.data.getAll(this.updateBillingType,updSubsData,this.helper.setHeaderData(),"POST"); 
  }
  addAccount(updSubsData){
    var currentUser=this.auth.getCurrentUser();
    updSubsData["profileToken"]=btoa(currentUser.userId);
    return this.data.getAll(this.addAccountAPI,updSubsData,this.helper.setHeaderData(),"POST"); 
  }
}
