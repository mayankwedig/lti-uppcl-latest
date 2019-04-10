import { AuthService } from './../services/authService/auth.service';
import { HelpersService } from './../services/helpers/helpers.service';
import { ValidateAccountNumberService } from './../services/validate-account-number/validate-account-number.service';
import { Component,OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";


@Component({
  selector: "app-signup",
  templateUrl: "./validate-account-number.component.html",
  styleUrls: ["./validateAccountNumber.component.css"]
})
export class ValidateAccountNumber implements OnInit {
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
  
  accountVerificationFrm: FormGroup;
  loder: boolean = false;
  isAccountNumberValid: string = "false";

  // convenience getter for easy access to form fields
  ngOnInit() {
    this.helpers.clearLocalStorateData("verifiedAccountNumber"); // clear previously verified account no. session
    this.helpers.clearLocalStorateData("isAccountNumberValid"); // clear previously verified account  flag session
    this.helpers.clearLocalStorateData("verifiedAccountInfo"); // clear previously verified account  flag session
    this.accountVerificationFrm = this.fb.group({
      account_number: ["", Validators.required]
    });
  }
  
  get f() {
    return this.accountVerificationFrm.controls;
  }

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router,
    private ValidateAccountNumber:ValidateAccountNumberService,
    private helpers:HelpersService,
    private auth:AuthService
  ) {
    
  }
  validateAccountNumber() {
    this.loder = true;
    this.ValidateAccountNumber.verifyAccountNumber(this.accountVerificationFrm.value.account_number)
    .subscribe((res:any)=>{
      this.loder = false;
      if(res.authCode){
        if(res.authCode == "200" && res.status){
          this.isAccountNumberValid="true";
          var accEmail="";
          var accMobile="";
          if(res.data_params.email != "" && res.data_params.email != null && res.data_params.email != 0){
            accEmail=res.data_params.email;
          }
          if(res.data_params.mobile != "" && res.data_params.mobile != null && res.data_params.mobile != 0){
            accMobile=res.data_params.mobile;
          }
          sessionStorage.setItem("isAccountNumberValid", this.isAccountNumberValid);
          sessionStorage.setItem("verifiedAccountNumber", this.accountVerificationFrm.value.account_number);
          sessionStorage.setItem("verifiedAccEmail",accEmail);
          sessionStorage.setItem("verifiedAccMobileNo", accMobile);
          this.toastr.success(res.msg, 'Success!');
          this.router.navigate(["/singup-otp-varification"]);

        
        }else{
          /* this.isAccountNumberValid="true";
          sessionStorage.setItem("isAccountNumberValid", this.isAccountNumberValid);
          sessionStorage.setItem("verifiedAccountNumber", this.accountVerificationFrm.value.account_number);
          sessionStorage.setItem("verifiedAccEmail", 'mayank.mourya@wedigtechc.com');
          sessionStorage.setItem("verifiedAccMobileNo", '123456789');
          this.toastr.success(res.msg, 'Success!');
          this.router.navigate(["/singup-otp-varification"]); */
          this.toastr.error(res.msg, 'Failed!');
        }
      }
    },(error)=>{
      this.loder=false;
      this.toastr.error(error, 'Failed!');
    });
    
  }
}
