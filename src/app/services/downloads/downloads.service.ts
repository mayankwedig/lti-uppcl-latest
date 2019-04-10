import { Injectable } from '@angular/core';
import { DataService } from "./../data.service";
import { HelpersService } from "./../helpers/helpers.service";
@Injectable({
  providedIn: 'root'
})
export class DownloadsService {

  constructor(private data:DataService,private helper: HelpersService) { }
  downloadDataGetAPI = "users/downloadDataGet";
 

  getDownloadsdata() {    
     return this.data.getAll(this.downloadDataGetAPI,'','',"GET");
   }

   
}

