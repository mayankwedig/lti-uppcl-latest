import { HelpersService } from './../helpers/helpers.service';
import { DataService } from './../data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {

  constructor(private dataService:DataService,private helpers:HelpersService) { }
  getSideBarMenus(){
   return this.dataService.getAll("users/sidebarManagementGet",{},this.helpers.setHeaderData(),"GET");
  }
}
