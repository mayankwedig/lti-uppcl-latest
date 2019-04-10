import { AuthService } from "./../services/authService/auth.service";
import { PayBillService } from "./../services/pay-bill/pay-bill.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
require("../../../node_modules/moment/min/moment.min.js");
import { TranslationService } from "../services/translation/translation.service";

declare var moment: any;
declare var $: any;

@Component({
  selector: "app-recharge-history",
  templateUrl: "./recharge-history.component.html",
  styleUrls: ["./recharge-history.component.css"]
})
export class RechargeHistoryComponent implements OnInit {
  accountNumber: any = "";
  rechargeDataLoder: boolean = false;
  isrechargeDataFound: boolean = false;
  rechargeData: any = "";
  dispString: any = "";
  rechargechartData: any = [];
  present_balance: any = "";

  /** Redirection Loder*/
  redirectLoding = false;
  PrimaryWhite = "#16689e";
  SecondaryGrey = "#ffffff";
  PrimaryRed = "#dd0031";
  SecondaryBlue = "#006ddd";
  public primaryColour = this.PrimaryWhite;
  public secondaryColour = this.SecondaryGrey;
  public coloursEnabled = false;

  public config = {
    primaryColour: this.primaryColour,
    secondaryColour: this.secondaryColour,
    tertiaryColour: this.primaryColour,
    backdropBorderRadius: "3px"
  };

  prompt(flag: string, msg: string) {
    this.payBillService.prompt(flag, msg);
  }
  constructor(
    private DashboardService: DashboardService,
    private activateRoute: ActivatedRoute,
    private helpers: HelpersService,
    private translationServices: TranslationService,
    private payBillService: PayBillService,
    private auth: AuthService,
    private router:Router
  ) {}
  getPaymentChksmLoader: boolean = false;
  billing = { accountNumber: this.accountNumber };
  isPaymentChksmReceived: boolean = false;
  showPaymentProcessSection: boolean = false;
  payMentDetails: any = {};
  rechargeAmount: any = null;

  ngOnInit() {
    if (this.helpers.getLocalStoragData("accountToken") != null) { // if account is selected
      let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
      let accountTokenInfo = accountToken.split(":");
      this.accountNumber = accountTokenInfo[1]; //account Number
      this.checkIfAccountIsPrepaid(this.accountNumber);
      this.dispString =
        this.translationServices.translate("accountnumber") +
        " ( " +
        this.accountNumber +
        " ) ";
      this.getrechargeData();
      this.billing = { accountNumber: this.accountNumber };
    } else { // if account is not selected.
      this.router.navigate(["/manageaccount"]);
      this.prompt("warning ","Please select account number");
    }
  }
  submitPaymentFrm() {
    setTimeout(() => {
      $("#payMentFrm").submit();
    }, 3000);
  }
  openRechargeAmount() {
    this.hideShowModal("recharge-amount", 1);
  }
  checkIfAccountIsPrepaid(accNumber) {
    this.payBillService.checkIfAccountIsPrepaid(this.accountNumber, (result: any) => {
      if (result.authCode == "200") {
        if (result.data_params.isPrepaid == "No") {
          this.router.navigate(["/pay-bill"]);
        }
      }
    });
  }
  hideShowModal(modal_name, flag = 0) {
    if (flag == 1) {
      //show modal
      if (modal_name == "recharge-pay") {
        // if recharge pay modal then disable click.
        $("#" + modal_name).modal({
          backdrop: "static",
          keyboard: false
        });
      }
      $("#" + modal_name).modal("show");
      $("#" + modal_name).addClass("in");
      $("#" + modal_name).css("display", "block");
    } else {
      // hide modal
      $("#" + modal_name).hide();
      $(".modal-backdrop").remove();
      $("body").removeClass("modal-open");
    }
  }
  getPaymentChecksm() {
    if (this.rechargeAmount != null) {
      // if am is not empty
      if (!isNaN(this.rechargeAmount) && this.rechargeAmount > 0) {
        // if amount is valid value and should be grater then 0
        if (this.billing.accountNumber != null) {
          // check if account number is not null
          this.hideShowModal("recharge-amount", 0);
          this.redirectLoding = true;
          this.payBillService
            .getPaymentChecksm(this.billing.accountNumber, this.rechargeAmount,"prePaid")
            .subscribe(
              (response: any) => {
                this.redirectLoding = false;
                if (response.authCode == "200" && response.status == true) {
                  this.isPaymentChksmReceived = true;
                  this.hideShowModal("recharge-pay", 1); // show recharge payment
                  this.payMentDetails = response.data_params.paramsData;
                  this.submitPaymentFrm();
                } else {
                  this.prompt("error", response.msg);
                  this.isPaymentChksmReceived = false;
                }
              },
              error => {
                this.prompt("error", "Something went wrong.");
                this.redirectLoding = false;
              }
            );
        } else {
          this.prompt("error", "Please provide account number");
        }
      } else {
        this.prompt("warning", "Please provide valid recharge amount");
      }
    } else {
      this.prompt("error", "Please provide recharge amount");
    }
  }

  getrechargeData() {
    this.rechargeDataLoder = true;
    this.DashboardService.getrechargeData(this.accountNumber).subscribe(
      (response: any) => {
        var res = response;
        this.rechargeDataLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.rechargeData = res.data_params;
            this.present_balance = res.present_balance;
            this.isrechargeDataFound = true;
          } else {
            this.isrechargeDataFound = false;
            this.rechargeData = "";
          }
        }
      },
      (error: AppError) => {
        this.isrechargeDataFound = false;
        this.rechargeDataLoder = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
}
