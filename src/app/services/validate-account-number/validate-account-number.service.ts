import { Injectable } from '@angular/core';
import { DataService } from './../data.service';
@Injectable({
  providedIn: 'root'
})
export class ValidateAccountNumberService {
  verifyAccountNumberAPI="users/SOAaddAccount";
  constructor(private data:DataService) { }
  verifyAccountNumber(account_number){
    return this.data.getAll(this.verifyAccountNumberAPI,{"account_number":account_number},'',"POST"); 
  }
}
