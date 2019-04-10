import { HelpersService } from "./../services/helpers/helpers.service";
import { AuthService } from "./../services/authService/auth.service";
import { Component, OnInit } from "@angular/core";

import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { CustomValidationsService } from "./../services/custom-validations/custom-validations.service";
import { ResetPasswordService } from "../services/reset-password/reset-password.service";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"]
})
export class ChangePasswordComponent implements OnInit {
  ChangePasswordFrm: FormGroup;
  changePassFuncLoader: boolean = false;
  userId: any = null;
  isExpiredPasswordChange:boolean=false;
  constructor(
    private toastr: ToastrService,
    private changePassword: ResetPasswordService,
    private CustomValidation: CustomValidationsService,
    private fb: FormBuilder,
    private _auth: AuthService,
    private helpersService: HelpersService,
    private router:Router,
    private auth:AuthService
  ) {}

  get changePassFields() {
    return this.ChangePasswordFrm.controls;
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
        cpassword: ["", Validators.required],
        oldPassword: ["", Validators.required]
      },
      { validator: this.CustomValidation.checkPasswords }
    );
  }
  ngOnInit() {
    if (this.helpersService.getLocalStoragData("changeExpPassword") != null && !this._auth.isLoggedIn()) { // if expired password change session is active
      let userId = this.helpersService.getLocalStoragData("changeExpPassword"); // get user id token
      this.userId = btoa(userId);
      this.helpersService.clearLocalStorateData("changeExpPassword"); // remove expired password session.
      this.isExpiredPasswordChange=true;
    } else {
      if (this._auth.isLoggedIn() && this.helpersService.getLocalStoragData("changeExpPassword") == null) { // if user loggedin
        let currentUser = this._auth.getCurrentUser();
        this.userId = btoa(currentUser.userId);
        this.isExpiredPasswordChange=false;
      }
    }
    this.initChangePasswordFrm();
  }

  changePassFunc() {
    this.changePassFuncLoader = true;
    const changePassData = this.ChangePasswordFrm.value;
    changePassData["resetPasswordToken"]=this.userId;
    this.changePassword
      .resetPassword(changePassData)
      .subscribe((response: any) => {
        this.changePassFuncLoader = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.toastr.success(res.msg, "Password updated!");
            if(!this.isExpiredPasswordChange){ // if user is changeing password after login
              this.auth.logout();
            }
            this.router.navigate(["/login"]);
          } else {
            this.toastr.error(res.msg, "Failed!");
          }
        }
      });
  }
}
