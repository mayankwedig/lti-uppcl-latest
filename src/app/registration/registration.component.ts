import { HelpersService } from "./../services/helpers/helpers.service";

import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { SignupService } from "../services/signup/signup.service"; //for later purpose
import { ToastrService } from "ngx-toastr";
import { CustomValidationsService } from "./../services/custom-validations/custom-validations.service";

import { Router } from "@angular/router";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"]
})
export class RegistrationComponent implements OnInit {
  signupFrm: FormGroup;

  questionsList1 = [];
  questionsList2 = [];

  loder: boolean = false;
  questionsList1Loader = false;
  questionsList2Loader = false;

  otpVerifiedAcInfo: any = {};
  constructor(
    private fb: FormBuilder,
    private SignupService: SignupService,
    private router: Router,
    private toastr: ToastrService,
    private CustomValidations: CustomValidationsService,
    private helpers: HelpersService
  ) {}

  //Initialize registration form
  initRegistrationFrm() {
    this.signupFrm = this.fb.group(
      {
        username: ["", Validators.required],
        email: [
          this.otpVerifiedAcInfo.email/* ,
          [this.CustomValidations.isEmailValid("email")] */
        ],
        mobile: [this.otpVerifiedAcInfo.mobile],
        password: [
          "",
          Validators.compose([
            Validators.required,
            Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/)
          ])
        ],
        cpassword: ["", Validators.required],
        questionsList1: ["", Validators.required],
        questionsList2: ["", Validators.required],
        ansques1: ["", Validators.required],
        ansques2: ["", Validators.required]
      },
      { validator: this.CustomValidations.checkPasswords }
    );
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.signupFrm.controls;
  }

  ngOnInit() {
    let otpVerifiedAccEmail = this.helpers.getLocalStoragData(
      "otpVerifiedAccEmail"
    ); // cehck if account token is exists
    let otpVerifiedAccMobileNo = this.helpers.getLocalStoragData(
      "otpVerifiedAccMobileNo"
    ); // cehck if account token is exists
    let otpVerifiedAccountNumber = this.helpers.getLocalStoragData(
      "otpVerifiedAccountNumber"
    );
    this.otpVerifiedAcInfo = {
      email: otpVerifiedAccEmail,
      mobile: otpVerifiedAccMobileNo,
      account_number: otpVerifiedAccountNumber
    };
    this.initRegistrationFrm();
    this.clearOtpVerifiedAccountInfoSession();
    this.fechQuestionList("1");
    this.fechQuestionList("2");
  }
  clearOtpVerifiedAccountInfoSession() {
    this.helpers.clearLocalStorateData("otpVerifiedAccEmail"); // verified  account info  session
    this.helpers.clearLocalStorateData("otpVerifiedAccMobileNo"); // verified  account info  session
    this.helpers.clearLocalStorateData("otpVerifiedAccountNumber"); // verified  account info  session
  }
  fechQuestionList(quesType) {
    if (quesType == "1") {
      this.questionsList1Loader = true;
    } else {
      this.questionsList2Loader = true;
    }

    this.SignupService.getQuestionList("users/questionList", {
      types: quesType
    }).subscribe((response: any) => {
      if (quesType == "1") {
        this.questionsList1Loader = false;
      } else {
        this.questionsList2Loader = false;
      }
      var res = response;
      if (res.authCode == "200") {
        if (quesType == "1") {
          this.questionsList1 = res.data_params;
        } else {
          this.questionsList2 = res.data_params;
        }
      } else {
        this.toastr.error(res.msg, "Failed!");
      }
    });
  }
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
  translate(string: string): string {
    return this.helpers.translate(string);
  }
  signUp() {
    this.signupFrm = this.helpers.markAsTouched(this.signupFrm);
    if (this.signupFrm.status != "INVALID") {
      const apiData = this.signupFrm.value;
      if (apiData.email == "" && apiData.mobile == "") {
        this.toastr.error(
          this.translate("Please provide your email address or mobile number")
        );
      } else {
        this.loder = true;
        apiData["accountNumber"] = this.otpVerifiedAcInfo.account_number;
        this.SignupService.registerUser("users/register", apiData).subscribe(
          (response: any) => {
            var res = response;
            this.loder = false;
            if (res.authCode) {
              if (res.authCode == "200" && res.status == true) {
                this.toastr.success(res.msg, "Success!");
                this.router.navigate(["/login"]);
              } else {
                this.toastr.error(res.msg, "Failed!");
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
    } else {
      this.toastr.warning(this.translate("Please fill required fields"));
    }
  }
}
