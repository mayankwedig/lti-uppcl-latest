import { ManageaccountService } from "./../manageaccount/manageaccount.service";
import { Injectable } from "@angular/core";
import { HelpersService } from "./../helpers/helpers.service";
import { DataService } from "./../data.service";
import { AuthService } from "../authService/auth.service";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class NewConnectionRequest {
  masterDropDownAPI = "users/masterDropDown";
  dropdownDataAPI = "users/dropdownData";
  addNewConnectionAPI = "users/addConnection";
  constructor(
    private userAccounts: ManageaccountService,
    private data: DataService,
    private auth: AuthService,
    private helper: HelpersService,
    private router:Router
  ) {}


  getMasterData(header) {
    return this.data.getAll(
      this.masterDropDownAPI,
      header,
      {},
      "POST"
    );
  }

  getlatestData(header){
     return this.data.getAll(this.masterDropDownAPI, header,this.helper.setHeaderData(),"POST");
  }


  getDivisions(header) {
    return this.data.getAll(
      this.dropdownDataAPI,
      header,
      {},
      "POST"
    );
  }
  
  addNewConnection(updSubsData) {
    var apiUrl=this.addNewConnectionAPI;
    var headerData={};
    if(this.auth.isLoggedIn()){
      var currentUser = this.auth.getCurrentUser();
      updSubsData["profileToken"] = btoa(currentUser.userId);
      headerData=this.helper.setHeaderData();
    }else{
      headerData={};
      apiUrl="users/addConnectionWithouLogin";
    }
    return this.data.getAll(apiUrl,
      updSubsData,
      headerData,
      "POST"
    );
    
   
  }
}
