import { environment } from 'src/environments/environment';
import { Component, OnInit } from '@angular/core';
import { PaymentOptionsService } from '../services/payment-options.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BadInput } from "./../common/bad-input";
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.css']
})
export class PaymentOptionsComponent implements OnInit {
  fetchAdQuery = "payment-options";
  dispString = "";
  paymentgatewayLoder : boolean= false;
  paymentData:any=[];
  accountNumber = "";
  isDataFound: boolean=false;



  constructor(
   private paymentOptionService : PaymentOptionsService,
   private router: Router,
   private fb: FormBuilder
  ) { }



  translate(string: string): string {
    return this.paymentOptionService.translate(string);
  }


  ngOnInit() {
    this.getPaymentOption();

  }
  
  getPaymentGateWayImage(data){
    
    if(data.icon != null && data.icon != ""){
      return environment.payment_options+'/'+data.icon;
    }else{
       return null;
    }
  }
  selectedPaymentGateway=0;
  choosedPaymentGateWay(data){
      console.log(data);
      this.selectedPaymentGateway=data;
  }
  redirectToPaymentGateway(){
    if(this.selectedPaymentGateway != 0){
      switch(this.selectedPaymentGateway){
        case 1 :
        window.location.href ="https://paytm.com/";
        break;
        case 3:
        window.location.href ="https://www.ccavenue.com/";
        break;
        case 4:
        window.location.href ="https://www.payumoney.com/";
        break;
        case 5:
        window.location.href ="https://www.cashfree.com/";
        break;
        case 6:
        window.location.href ="https://www.atomtech.in/";
        break;
        case 7:
        window.location.href ="https://www.paypal.com/in/webapps/mpp/home";
        break;
        default:
        this.router.navigate(["/home"]);
        break;
      }


    }
  }
  getPaymentOption() {
    this.paymentgatewayLoder = true;
    this.paymentOptionService.getPaymentOptions().subscribe(
      (response: any) => {
        this.paymentgatewayLoder = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.isDataFound=true;
            this.paymentData = res.data_params;
          } else {
            this.isDataFound=false;
            this.paymentData = [];
          }
        }
      },
      error => {
        this.isDataFound=false;
        this.paymentgatewayLoder = false;
        this.paymentData = [];
        throw error;
      }
    );
  }

}
