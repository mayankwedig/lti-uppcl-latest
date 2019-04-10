import { DataService } from './../data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PeakLoadManageService {

  constructor(private _data:DataService) { }
  getAboutContent(data){
    return this._data.getAll("users/staticPage",data,{},"POST");
  }
}
