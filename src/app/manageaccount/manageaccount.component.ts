import { WindowRefService } from "./../services/window-ref/window-ref.service";
import { SignupOtpVerificationService } from "./../services/signup-otp-verification/signup-otp-verification.service";
import { LoginService } from "./../services/login/login.service";
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { ProfileService } from "./../services/profile/profile.service";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { AuthService } from "../services/authService/auth.service";
import { ManageaccountService } from "./../services/manageaccount/manageaccount.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValidateAccountNumberService } from "./../services/validate-account-number/validate-account-number.service";
import { Router } from "@angular/router";
import { TranslationService } from "../services/translation/translation.service";
import Swal from "sweetalert2";
import { exists } from "fs";

@Component({
  selector: "app-manageaccount",
  templateUrl: "./manageaccount.component.html",
  styleUrls: ["./manageaccount.component.css"]
})
export class ManageaccountComponent implements OnInit {
  loder: any = false;
  isDataFound = false;
  accountData: any = "";
  searchKeyWord: any = "";
  addAccountFrm: FormGroup;
  accountProcesLoader = false;
  displayUserInfo = "";
  dispString = "";
  ShowOtpVerifyFrm: boolean = false;

  Otoploder: boolean = false;

  public OtpVerificationFrm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private accountServices: ManageaccountService,
    private toastr: ToastrService,
    private auth: AuthService,
    private router: Router,
    private uerProfile: ProfileService,
    private helper: HelpersService,
    private Dashboard: DashboardService,
    private login: LoginService,
    private ValidateAccountNumber: ValidateAccountNumberService,
    private OtpVeriyService: SignupOtpVerificationService,
    private WindowRef: WindowRefService,
    private _helper: HelpersService,
    private _translate: TranslationService
  ) {}
  ngOnInit() {
    var UserData = this.login.getUserData();
    if (UserData.numberOfAccounts > 1) {
      // If user has more then one account.
      this.helper.clearLocalStorateData("accountToken"); //clear previously set accountAccessToken
    }
    this.dispString = this.translate("accountnumber") + " ( " + +" ) ";

    this.getAccount(this.searchKeyWord);
    this.initAddaccFrm();
    this.getUserProfile();
  }
  translate(string: string): string {
    return this._helper.translate(string);
  }
  get f() {
    return this.addAccountFrm.controls;
  }
  get OtpVerificationFields() {
    return this.OtpVerificationFrm.controls;
  }
  getUserProfile() {
    this.dispString =
      "User Name ( " + this.auth.getCurrentUser().username + " )";
  }
  initAddaccFrm() {
    this.ShowOtpVerifyFrm = false;
    this.addAccountFrm = this.fb.group({
      account_number: ["", Validators.required]
    });
    this.initOtpVerificationForm();
  }
  initOtpVerificationForm() {
    this.OtpVerificationFrm = this.fb.group({
      verifyOtp: ["", Validators.required]
    });
  }
  getAccount(searchKeyWord) {
    this.loder = true;

    this.accountServices.getAccount(searchKeyWord).subscribe(
      (response: any) => {
        var res = response;
        this.loder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.accountData = res.data_params;
            this.isDataFound = true;
          } else {
            this.toastr.error(
              this._translate.translate(res.msg),
              this._translate.translate("failed!")
            );
            this.isDataFound = false;
          }
        }
      },
      (error: AppError) => {
        this.isDataFound = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
  search(value) {
    this.searchKeyWord = value;
    this.getAccount(this.searchKeyWord);
  }

  verifyOtp() {
    const verifyOtpData = this.OtpVerificationFrm.value;
    var verifiedAccountNumber = this.helper.getLocalStoragData(
      "verifiedAccountNumber"
    );
    this.helper.clearLocalStorateData("verifiedAccountNumber"); //Clear account number session

    this.Otoploder = true;

    if (verifiedAccountNumber != null) {
      // if verified account no is set
      verifyOtpData["otpAccountNumber"] = verifiedAccountNumber;
      this.OtpVeriyService.verifyOtp(
        "users/otpVerifyRegistration",
        verifyOtpData
      ).subscribe(
        (response: any) => {
          var res = response;
          if (res.authCode) {
            if (res.authCode == "200" && res.status == true) {
              var accountData = { account_number: verifiedAccountNumber };
              this.accountServices.addAccount(accountData).subscribe(
                (response: any) => {
                  var res = response;
                  this.Otoploder = false;
                  if (res.authCode) {
                    if (res.authCode == "200" && res.status == true) {
                      this.toastr.success(
                        this._translate.translate(res.msg),
                        this._translate.translate("Success!")
                      );
                      $("#add-account-modal").hide();
                      $(".modal-backdrop").remove();
                      $("body").removeClass("modal-open");
                      this.getAccount(this.searchKeyWord);
                      this.initAddaccFrm();
                    } else {
                      this.initAddaccFrm();
                      this.toastr.error(
                        this._translate.translate(res.msg),
                        this._translate.translate("Faild!")
                      );
                    }
                  }
                },
                (error: AppError) => {
                  this.Otoploder = false;
                  this.initAddaccFrm();
                  if (error instanceof BadInput) {
                  } else {
                    throw error;
                  }
                }
              );
            } else {
              this.Otoploder = false;
              this.initAddaccFrm();
              this.toastr.error(
                this._translate.translate(res.msg),
                this._translate.translate("Failed!")
              );
            }
          }
        },
        (error: AppError) => {
          this.Otoploder = false;
          this.initAddaccFrm();
          if (error instanceof BadInput) {
          } else {
            throw error;
          }
        }
      );
    } else {
      this.Otoploder = false;
      this.initAddaccFrm();
    }
  }
  addAccountFunc() {
    // login funtion goes here
    const accountData = this.addAccountFrm.value.account_number;
    this.accountProcesLoader = true;
    this.ValidateAccountNumber.verifyAccountNumber(accountData).subscribe(
      (res: any) => {
        this.accountProcesLoader = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status) {
            sessionStorage.setItem(
              "verifiedAccountNumber",
              res.data_params.account_number
            ); // set session for verified account number.
            this.ShowOtpVerifyFrm = true;
            this.toastr.success(
              this._translate.translate(res.msg),
              this._translate.translate("Success!")
            );
          } else {
            this.initAddaccFrm();
            this.toastr.error(
              this._translate.translate(res.msg),
              this._translate.translate("Failed!")
            );
          }
        }
      },
      error => {
        this.accountProcesLoader = false;
        this.initAddaccFrm();
        this.toastr.error(
          this._translate.translate(error),
          this._translate.translate("Failed!")
        );
      }
    );
  }
  deleteAccount(account) {
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it"
    }).then(result => {
      if (result.value) {
        var deleteData = { accountToken: btoa(account) };
        this.accountServices.deleteAccount(deleteData).subscribe(
          (response: any) => {
            var res = response;
            this.loder = false;
            if (res.authCode) {
              if (res.authCode == "200" && res.status == true) {
                this.toastr.success(
                  this._translate.translate(res.msg),
                  this._translate.translate("Success!")
                );
                this.getAccount(this.searchKeyWord);
              } else {
                this.toastr.error(
                  this._translate.translate(res.msg),
                  this._translate.translate("failed!")
                );
              }
            }
          },
          (error: AppError) => {
            if (error instanceof BadInput) {
            } else {
              throw error;
            }
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  changeSubscribtion($event, flag, rec_id, acc_no) {
    var update_value = $event.currentTarget.checked == true ? 1 : 2;
    var updSubsData = {
      record_id: btoa(rec_id),
      account_id: btoa(acc_no),
      subscribtion_to_update: flag,
      update_value: update_value
    };
    this.accountServices.changeSubscribtion(updSubsData).subscribe(
      (response: any) => {
        var res = response;
        this.loder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            var msgText = update_value == 1 ? "subscribed" : "unsubscribed ";
            var msgDisp = "";
            if (flag == "ebill") {
              // if Ebill
              if (update_value == 1) {
                // subscribed
                msgDisp = "You have successfully subscribed to E-Bill";
                this.toastr.success(
                  this._translate.translate(msgDisp),
                  this._translate.translate("Success!")
                );
              } else {
                // unsubscribed
                msgDisp = "You have successfully unsubscribed from the E-Bill";
                this.toastr.warning(
                  this._translate.translate(msgDisp),
                  this._translate.translate("Success!")
                );
              }
            } else {
              // Mobile bill
              if (update_value == 1) {
                // subscribed
                msgDisp = "You have successfully subscribed to Mobile-Bill";
                this.toastr.success(
                  this._translate.translate(msgDisp),
                  this._translate.translate("Success!")
                );
              } else {
                // unsubscribed
                msgDisp =
                  "You have successfully unsubscribed from the Monile-Bill";
                this.toastr.warning(
                  this._translate.translate(msgDisp),
                  this._translate.translate("Success!")
                );
              }
            }
            /*  this.toastr.success(res.msg, "Success!"); */
            /*   this.getAccount(this.searchKeyWord); */
          } else {
            this.toastr.error(
              this._translate.translate(res.msg),
              this._translate.translate("failed!")
            );
          }
        }
      },
      (error: AppError) => {
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
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
  /** Redirection Loder Ends Here*/
  redirectoPaymentPage(accountId, userId) {
    //window.open('https://paytm.com', '_blank');
    //return false;
    this.Dashboard.getAccountDetails(accountId, (result: any) => {
      if (result.authCode == "200") {
        if (result.data_params.isPrepaid) {
          this.router.navigate(["/recharge-history"]);
        } else {
          this.router.navigate(["/pay-bill"]);
        }
      } else {
        this.router.navigate(["/pay-bill"]);
      }
    });
  }
  redirectoDashBoard(accountId, userId) {
    this.redirectLoding = true; // make loder true
    var userId = this.auth.getCurrentUser().userId;
    var is_net_metering = 0;
    //fetching Account details for getting net metering is on/off
    this.Dashboard.getAccountDetails(accountId, (result: any) => {
      this.redirectLoding = false;
      if (result.authCode == "200") {
        is_net_metering = result.data_params.is_net_metering;
        this.helper.setLocalStoragData(
          "accountToken",
          btoa(userId + ":" + accountId + ":" + is_net_metering)
        ); // set new account access token.
      } else {
        this.helper.setLocalStoragData(
          "accountToken",
          btoa(userId + ":" + accountId + ":" + 0)
        ); // set new account access token.
      }
      this.router.navigate(["/dashboard"]); //redirect user to dashboard.
    });
  }
}
