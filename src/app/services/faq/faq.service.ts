import { DataService } from './../data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private dataSerivce:DataService) { }
  getFaq(){
    return this.dataSerivce.getAll("users/masterDropDown",{"supplyType":"faqs"},{},"POST")
  }
}
