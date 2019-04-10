import { Injectable } from '@angular/core';
import { DataService } from "./../data.service";
import { HelpersService } from "./../helpers/helpers.service";

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private data:DataService,private helper: HelpersService) { }
  masterDropDownAPI = "users/masterDropDown";
  ministermessageAPI = "users/cmMessage";
  importantlinkAPI = "users/importantLink";

  getMasterData(header) {
   /*console.log(header);*/
    return this.data.getAll(
      this.masterDropDownAPI,
      header,
      '',
      "POST"
    );
  }

  getMinisterdata() {    
     return this.data.getAll(this.ministermessageAPI,'',"POST");
   }

   getImportantLink() {    
    return this.data.getAll(this.importantlinkAPI,'',"POST");
  }
  getMissionandVision(){
    return this.data.getAll("users/homePageData",'',{},"GET");
  }
 
}
