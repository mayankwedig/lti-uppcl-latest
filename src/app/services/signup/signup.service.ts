import { DataService } from '../data.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SignupService{
  constructor(private DataService:DataService) {
    
   }
   registerUser(api_url,data_object){
    return this.DataService.create(api_url,data_object);
   }
   getQuestionList(api_url,body){
  
  
    return this.DataService.getAll(api_url,body,null,"POST");
   }
}

