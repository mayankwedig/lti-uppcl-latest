import { Injectable } from '@angular/core';
import { AuthService } from "./authService/auth.service";
import { HelpersService } from "./helpers/helpers.service";
import { DataService } from "./data.service";



@Injectable({
  providedIn: 'root'
})
export class PaymentOptionsService {

  constructor(
    private DataService: DataService,
    private AuthService: AuthService,
    private helpers: HelpersService,
  ) { }

 paymentGatewayType="users/paymentGatewayType"

  translate(string: string): string {
    return this.helpers.translate(string);
  }

  getPaymentOptions(){
    return this.DataService.getAll(this.paymentGatewayType,{},'',"GET");
    };
    
   


}
