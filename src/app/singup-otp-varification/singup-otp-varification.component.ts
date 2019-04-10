import { HelpersService } from './../services/helpers/helpers.service';
import { AuthService } from './../services/authService/auth.service';
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { SignupOtpVerificationService } from './../services/signup-otp-verification/signup-otp-verification.service';
import { TranslationService } from "../services/translation/translation.service";


declare var $: any;

@Component({
  selector: "app-singup-otp-varification",
  templateUrl: './singup-otp-varification.component.html',
  styleUrls: ['./singup-otp-varification.component.css']
})
export class SingupOtpVarificationComponent implements OnInit{
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

  public loder: boolean = false;
  public  OtpVerificationFrm: FormGroup;
  
  verifiedAccountNumber="";
  isAccountNumberValid="false";
  otpVerifiedAccEmail :any="";
  otpVerifiedAccMobileNo :any="";
  initOtpVerificationForm() {
    this.OtpVerificationFrm = this.fb.group({ verifyOtp: ["", Validators.required] });
  }
  get OtpVerificationFields() {
    return this.OtpVerificationFrm.controls;
  }
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private OtpVeriyService: SignupOtpVerificationService,
    private AuthService: AuthService,
    private helpers :HelpersService,
    private translationServices: TranslationService

  ) {
  }
  ngOnInit() {
    
    var verifiedAccountNumber=this.helpers.getLocalStoragData("verifiedAccountNumber");
    var isAccountNumberValid=this.helpers.getLocalStoragData("isAccountNumberValid");
    var otpVerifiedAccEmail= this.helpers.getLocalStoragData("verifiedAccEmail");
    var otpVerifiedAccMobileNo= this.helpers.getLocalStoragData("verifiedAccMobileNo");
    if(verifiedAccountNumber != null && isAccountNumberValid !=null && otpVerifiedAccEmail != null && otpVerifiedAccMobileNo != null){
          if(isAccountNumberValid == "true"){
            this.verifiedAccountNumber=verifiedAccountNumber;
            this.isAccountNumberValid=isAccountNumberValid;
            this.otpVerifiedAccEmail=otpVerifiedAccEmail;
            this.otpVerifiedAccMobileNo=otpVerifiedAccMobileNo;
            this.clearVerifiedAccountSession();
          }
    }else{
      this.router.navigate(["/account-verification"]);
    }
    this.initOtpVerificationForm();
  }
  Otoploder:boolean = true;
  verifyOtp() {
    const verifyOtpData = this.OtpVerificationFrm.value;
    verifyOtpData["otpAccountNumber"] = this.verifiedAccountNumber;
    this.Otoploder = true;
    this.OtpVeriyService.verifyOtp("users/otpVerifyRegistration", verifyOtpData).subscribe(
      (response: any) => {
        var res = response;
        this.Otoploder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.toastr.success(this.translationServices.translate(res.msg), "Success!");
            sessionStorage.setItem("otpVerifiedAccEmail",  this.otpVerifiedAccEmail);
            sessionStorage.setItem("otpVerifiedAccMobileNo",  this.otpVerifiedAccMobileNo);
            sessionStorage.setItem("otpVerifiedAccountNumber",  this.verifiedAccountNumber);
            this.router.navigate(["/registration"]);
          } else {
            /*
            sessionStorage.setItem("otpVerifiedAccEmail",  this.otpVerifiedAccEmail);
            sessionStorage.setItem("otpVerifiedAccMobileNo",  '8769433262');
            sessionStorage.setItem("otpVerifiedAccountNumber",  '111111555555');
            this.router.navigate(["/registration"]); */
            this.toastr.error(this.translationServices.translate(res.msg), "Failed!");
            this.router.navigate(["/account-verification"]);
          }
        }
      },
      (error: AppError) => {
       this.clearVerifiedAccountSession();
       this.router.navigate(["/account-verification"]);
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
  
  clearVerifiedAccountSession(){
    this.helpers.clearLocalStorateData("verifiedAccountNumber"); // verified account no. session
            this.helpers.clearLocalStorateData("isAccountNumberValid"); // verified account  flag session
            this.helpers.clearLocalStorateData("verifiedAccountInfo"); // verified  account info  session
            this.helpers.clearLocalStorateData("verifiedAccEmail"); // verified  account info  session
            this.helpers.clearLocalStorateData("verifiedAccMobileNo"); // verified  account info  session
  }
}
