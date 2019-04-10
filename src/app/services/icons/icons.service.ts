import { Injectable } from '@angular/core';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root'
})
export class IconsService {

  constructor(private _data:DataService) { }
  getIcons(){
    return this._data.getAll("users/iconManagement",{},{},"GET");
  }
  
}
