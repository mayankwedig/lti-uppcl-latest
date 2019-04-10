import { AuthService } from './../authService/auth.service';
import { Injectable } from '@angular/core';
import { DataService } from './../data.service';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  searchAPIUrl="users/searchLists";
  constructor(private _data:DataService,private _auth:AuthService) { }
  search(searchKeyWord){
    var header={};
    var currentUser=this._auth.getCurrentUser();
    if(currentUser != null){
      header["profileToken"]=btoa(currentUser.userId);
    }else{
      header["profileToken"]=null;
    }
    header["searchKeyWord"]=searchKeyWord;
    return this._data.getAll(this.searchAPIUrl,header,'',"POST");
  }
}
