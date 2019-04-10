import { DataService } from './../data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AdvertisementService {
  private adAPI="users/advertisement";  

  constructor(private _data:DataService) { }

  getAds(body){
    return this._data.getAll(this.adAPI, body,{},"POST");
   }
}
