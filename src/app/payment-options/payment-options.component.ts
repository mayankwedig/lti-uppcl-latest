import { environment } from "src/environments/environment";
import { Component, OnInit } from "@angular/core";
import { PaymentOptionsService } from "../services/payment-options.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BadInput } from "./../common/bad-input";
import { forEach } from "@angular/router/src/utils/collection";
import { PayBillService } from "./../services/pay-bill/pay-bill.service";
@Component({
  selector: "app-payment-options",
  templateUrl: "./payment-options.component.html",
  styleUrls: ["./payment-options.component.css"]
})
export class PaymentOptionsComponent implements OnInit {
  fetchAdQuery = "payment-options";
  dispString = "";
  paymentgatewayLoder: boolean = false;
  paymentData: any = [];
  accountNumber = "";
  isDataFound: boolean = false;
  billing: any = {};
  constructor(
    private paymentOptionService: PaymentOptionsService,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private PayBillService: PayBillService
  ) {}

  translate(string: string): string {
    return this.paymentOptionService.translate(string);
  }
  ngOnInit() {
    this.getPaymentOption();
    this.getBillingDetails();
  }

  getPaymentGateWayImage(data) {
    if (data.icon != null && data.icon != "") {
      return environment.payment_options + "/" + data.icon;
    } else {
      return null;
    }
  }
  selectedPaymentGateway = 0;
  choosedPaymentGateWay(data) {
    this.selectedPaymentGateway = data;
  }
  getBillingDetails() {
    this.activatedRoute.queryParams.subscribe(result => {
      if (result.paymentToken != null) {
        const token = JSON.parse(atob(result.paymentToken));
        this.billing = {
          accountNumber: token["accountNumber"],
          payable_amount: token["payable_amount"],
          type: token["type"]
        };
      } else {
        this.router.navigate(["/home"]);
      }
    });
  }
  /**********************Paytm checkout*******************************/

  paytmCheckoutLoader: boolean = true;
  isPaymentChksmReceived: boolean = false;
  showPaymentProcessSection: boolean = false;
  paytmPayMentDetails: any = {};

  submitPaymentFrm() {
    if (this.isPaymentChksmReceived) {
      setTimeout(() => {
        $("#paytmFrm").submit();
      }, 10);
    } else {
      this.prompt("error", "Something went wrong!");
    }
  }
  prompt(flag: string, msg: string) {
    this.PayBillService.prompt(flag, msg);
  }
  paytmCheckout() {
    this.paytmCheckoutLoader = true;
    if (this.billing.accountNumber != null) {
      this.PayBillService.getPaymentChecksm(
        this.billing.accountNumber,
        this.billing.payable_amount,
        this.billing.type
      ).subscribe(
        (response: any) => {
          this.paytmCheckoutLoader = false;
          if (response.authCode == "200" && response.status == true) {
            this.isPaymentChksmReceived = true;
            this.showPaymentProcessSection = true;
            this.paytmPayMentDetails = response.data_params.paramsData;
            this.submitPaymentFrm();
          } else {
            this.showPaymentProcessSection = false;
            this.prompt("error", response.msg);
            this.isPaymentChksmReceived = false;
          }
        },
        error => {
          this.prompt("error", "Something went wrong!");
          this.showPaymentProcessSection = false;
          this.paytmCheckoutLoader = false;
        }
      );
    } else {
      this.paytmCheckoutLoader = false;
      this.prompt("error", "Please provide account number");
    }
  }
  /**********************End Paytm checkout *******************************/
  redirectToPaymentGateway() {
    if (this.selectedPaymentGateway != 0) {
      switch (this.selectedPaymentGateway) {
        case 1:
          //window.location.href = "https://paytm.com/";
          this.paytmCheckout();
          break;
        case 3:
          window.location.href = "https://www.ccavenue.com/";
          break;
        case 4:
          window.location.href = "https://www.payumoney.com/";
          break;
        case 5:
          window.location.href = "https://www.cashfree.com/";
          break;
        case 6:
          window.location.href = "https://www.atomtech.in/";
          break;
        case 7:
          window.location.href = "https://www.paypal.com/in/webapps/mpp/home";
          break;
        default:
          this.router.navigate(["/home"]);
          break;
      }
    } else {
      this.prompt("error", "Please select payment option");
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
            this.isDataFound = true;
            this.paymentData = res.data_params;
          } else {
            this.isDataFound = false;
            this.paymentData = [];
          }
        }
      },
      error => {
        this.isDataFound = false;
        this.paymentgatewayLoder = false;
        this.paymentData = [];
        throw error;
      }
    );
  }
}
