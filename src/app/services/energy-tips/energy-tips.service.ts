import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { _MatDatepickerContentMixinBase } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class EnergyTipsService {

  constructor(private _data:DataService) { }
  getEnergyTips(){
    return this._data.getAll("users/energyTips",{},{},"GET");
  }
}
