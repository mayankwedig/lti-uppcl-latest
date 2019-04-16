import { Component, OnInit } from '@angular/core';
import { PaymentOptionsService } from '../services/payment-options.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BadInput } from "./../common/bad-input";

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.css']
})
export class PaymentOptionsComponent implements OnInit {
  fetchAdQuery = "pay-bill";
  dispString = "";
  paymentgatewayLoder : boolean= false;
  paymentData:any=[];
  accountNumber = "";
  isAlertDataFound: boolean=false;



  constructor(
   private paymentOptionService : PaymentOptionsService,
   private router: Router,
   private fb: FormBuilder
  ) { }



  translate(string: string): string {
    return this.paymentOptionService.translate(string);
  }


  ngOnInit() {
        this.dispString =
          this.translate("accountnumber") + " ( " + this.accountNumber + " ) ";
    this.getPaymentOption();
  }


  getPaymentOption() {
    this.paymentgatewayLoder = true;
    this.paymentOptionService.getPaymentOptions().subscribe(
      (response: any) => {
        this.paymentgatewayLoder = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.paymentData = res.data_params;
          } else {
            this.paymentData = [];
          }
        }
      },
      error => {
        this.paymentgatewayLoder = false;
        this.paymentData = [];
        throw error;
      }
    );
  }

}
