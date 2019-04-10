import { HomeService } from './../home/home.service';
import { DataService } from './../data.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AboutService {

  constructor(private _data:DataService,private _homeSerivce:HomeService){}

  getAboutContent(data){
    return this._data.getAll("users/staticPage",data,{},"POST");
  }
  getMissionandVision(){
    return this._homeSerivce.getMissionandVision();
  }
  getBoardOfDirectors(){
    return this._data.getAll("users/boardDirectors",{},{},"GET");
  }
  getOrgChart(){
    return this._data.getAll("users/staticPage",{"slug":"organisation-structure"},{},"POST");
  }

}
