import { OtpVerificationService } from "./../services/otp-varification/otp-verification.service";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { LoginService } from "./../services/login/login.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { CustomValidationsService } from "./../services/custom-validations/custom-validations.service";
import { TranslationService } from "../services/translation/translation.service";

declare var $: any;

@Component({
  selector: "app-otp-verification",
  templateUrl: "./otp-verification.component.html",
  styleUrls: ["./otp-verification.component.css"]
})
export class OtpVerificationComponent {
  sliderContent = [
    {
      image: "../assets/images/main-slide1.jpg",
      desc: "Changing The Power<br> That Changes<br> The World"
    },
    {
      image: "../assets/images/main-slide2.jpg",
      desc: "Changing The Power<br> That Changes<br> The World"
    },
    {
      image: "../assets/images/main-slide3.jpg",
      desc: "Changing The Power<br> That Changes<br> The World"
    }
  ];

  private loder: boolean = false;
  private changePassFuncLoader: boolean = false;
  private otpVerificationToken: string = "";
  isOtpVerified = false;

  private OtpVerificationFrm: FormGroup;
  private ChangePasswordFrm: FormGroup;

  initOtpVerificationForm() {
    this.OtpVerificationFrm = this.fb.group({ otp: ["", Validators.required] });
  }
  initChangePasswordFrm() {
    this.ChangePasswordFrm = this.fb.group(
      {
        password: [
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/)
          ])
        ],
        cpassword: ["", Validators.required]
      },
      { validator: this.CustomValidation.checkPasswords }
    );
  }

  constructor(
    private login: LoginService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private OtpVeriyService: OtpVerificationService,
    private CustomValidation: CustomValidationsService,
    private translationServices: TranslationService

  ) {
    this.otpVerificationToken = this.OtpVeriyService.getOtpVerificationSession();
    var getWithSequityQuesSessoin = sessionStorage.getItem("withSequityQues");

    if (this.otpVerificationToken != null) {
      if (getWithSequityQuesSessoin != null) {
        sessionStorage.removeItem("withSequityQues");
        //checking if token is set
        if (getWithSequityQuesSessoin == "true") {
          // if true
          this.isOtpVerified = true;
        } else {
          //if false
          this.isOtpVerified = false;
        }
      }

      this.initOtpVerificationForm();
      this.initChangePasswordFrm();
      this.OtpVeriyService.clearOtpSessionData();
    }
  }
  changePassFunc() {
    //var apiUrl="users/resetPassword"; old
    var apiUrl="users/resetPasswordWithoutLogin";
    this.changePassFuncLoader = true;
    const changePassData = this.ChangePasswordFrm.value;
    changePassData["resetPasswordToken"] = this.otpVerificationToken;
    this.OtpVeriyService.changePassSerive(
      apiUrl ,
      changePassData
    ).subscribe((response: any) => {
      this.changePassFuncLoader = false;
      var res = response;
      if (res.authCode) {
        if (res.authCode == "200" && res.status == true) {
          this.toastr.success(this.translationServices.translate(res.msg), this.translationServices.translate("Password updated!"));
        } else {
          this.toastr.error(this.translationServices.translate(res.msg), this.translationServices.translate("Failed!"));
        }
        this.otpVerificationToken = "";
        this.router.navigate(["/login"]);
      }
    });
  }
  verifyOtp() {
    const verifyOtpData = this.OtpVerificationFrm.value;
    verifyOtpData["otpToken"] = this.otpVerificationToken;
    this.loder = true;
    this.OtpVeriyService.verifyOtp("users/otpVerify", verifyOtpData).subscribe(
      (response: any) => {
        /*  this.OtpVeriyService.clearOtpSessionData(); */
        var res = response;
        this.loder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.toastr.success(this.translationServices.translate(res.msg), this.translationServices.translate("Success!"));
            this.isOtpVerified = true;
          } else {
            this.toastr.error(this.translationServices.translate(res.msg), this.translationServices.translate("Failed!"));
            this.isOtpVerified = false;
            this.router.navigate(["/login"]);
          }
        }
      },
      (error: AppError) => {
        this.OtpVeriyService.clearOtpSessionData();
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
  get OtpVerificationFields() {
    return this.OtpVerificationFrm.controls;
  }
  get changePassFields() {
    return this.ChangePasswordFrm.controls;
  }
}
