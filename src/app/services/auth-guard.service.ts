import { HelpersService } from "./helpers/helpers.service";
import { LoginService } from "./login/login.service";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TranslationService } from "../services/translation/translation.service";

import {
  CanActivate,
  Router,
  RouterStateSnapshot,
  ActivatedRoute
} from "@angular/router";
import { AuthService } from "./authService/auth.service";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private auth: AuthService,
    private loginService: LoginService,
    private activateRoute: ActivatedRoute,
    private helpers: HelpersService,
    private toastr: ToastrService,
    private translationServices: TranslationService
  ) {}

  canActivate(route, state: RouterStateSnapshot) {
    if (state.url == "/registration") {
      //if registration page
      let otpVerifiedAccEmail = this.helpers.getLocalStoragData(
        "otpVerifiedAccEmail"
      ); // cehck if account token is exists
      let otpVerifiedAccMobileNo = this.helpers.getLocalStoragData(
        "otpVerifiedAccMobileNo"
      ); // cehck if account token is exists
      let otpVerifiedAccountNumber = this.helpers.getLocalStoragData(
        "otpVerifiedAccountNumber"
      );
      if (
        otpVerifiedAccEmail != null &&
        otpVerifiedAccMobileNo != null &&
        otpVerifiedAccountNumber != null
      ) {
        //check if user has verified account number
        return true; // if yes
      } else {
        //if no
        this.router.navigate(["/account-verification"]); // redirect usre back to the account verfication page for account verification
        return false;
      }
    } else if (state.url == "/otp-verification") {
      // If Otp Verification page
      // check if valid user ID is exists
      if (this.loginService.getOtpVerificationSession() != null) {
        //check if user has verified account number
        return true; // if yes
      } else {
        // If Otp Verificatoiin has exprired.
        //if no
        this.router.navigate(["/login"]); // redirect usre back to the account verfication page for account verification
        return false;
      }
    } else if (state.url == "/dashboard") {
      // If Dashboard
      if (this.auth.isLoggedIn()) {
        // is user Logged in
        // if user is logged in
        let accountToken = this.helpers.getLocalStoragData("accountToken"); // get account number
        if (accountToken == null) {
          // check if accountToken doesn't exits
          this.toastr.warning(
            this.translationServices.translate("Please select account number"),
            ""
          ); // prompt msg
          this.router.navigate(["/manageaccount"]); // redirect user to manage account
          return true;
        } else {
          //  if account token found then
          let accountTokenInfo = atob(accountToken).split(":");
          if (accountTokenInfo[0] != this.auth.getCurrentUser().userId) {
            // check if account token not belongs to currently logged in  user
            this.toastr.warning(
              this.translationServices.translate(
                "Please select account number"
              ),
              ""
            ); // propmt msg
            this.router.navigate(["/manageaccount"]); // redirect user to manage account
            return true;
          } else {
            return true; // if yes then everything is ok
          }
        }
      } else {
        // else redirect back to login page.
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    } else if (state.url == "/consumption") {
      if (this.auth.isLoggedIn()) {
        // check if user is logged in.
        let accountToken = this.helpers.getLocalStoragData("accountToken"); // cehck if account token is exists
        if (accountToken == null) {
          this.toastr.warning(
            this.translationServices.translate("Please select account number"),
            ""
          ); // prompt msg
          // if not
          this.router.navigate(["/manageaccount"]); // redirect user to manage account
          return true;
        } else {
          let accountTokenInfo = atob(accountToken).split(":");
          if (accountTokenInfo[0] != this.auth.getCurrentUser().userId) {
            // check if account token not belongs to current user
            this.toastr.warning(
              this.translationServices.translate(
                "Please select account number"
              ),
              ""
            ); // prompt msg
            this.router.navigate(["/manageaccount"]); // redirect user to manage account
            return true;
          } else {
            return true; // if yes
          }
        }
      } else {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    } else if (state.url == "/net-metering") {
      if (this.auth.isLoggedIn()) {
        // check if user is logged in.
        let accountToken = this.helpers.getLocalStoragData("accountToken"); // cehck if account token is exists
        if (accountToken == null) {
          this.toastr.warning(
            this.translationServices.translate("Please select account number"),
            ""
          ); // prompt msg
          // if not
          this.router.navigate(["/manageaccount"]); // redirect user to manage account
          return true;
        } else {
          let accountTokenInfo = atob(accountToken).split(":");
          if (accountTokenInfo[0] != this.auth.getCurrentUser().userId) {
            // check if account token not belongs to current user
            this.toastr.warning(
              this.translationServices.translate(
                "Please select account number"
              ),
              ""
            ); // prompt msg
            this.router.navigate(["/manageaccount"]); // redirect user to manage account
            return true;
          } else {
            return true; // if yes
          }
        }
      } else {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    } else if (state.url == "/view-all-service-request") {
      if (this.auth.isLoggedIn()) {
        // check if user is logged in.
        let accountToken = this.helpers.getLocalStoragData("accountToken"); // cehck if account token is exists
        if (accountToken == null) {
          this.toastr.warning(
            this.translationServices.translate("Please select account number"),
            ""
          ); // prompt msg
          // if not
          this.router.navigate(["/manageaccount"]); // redirect user to manage account
          return true;
        } else {
          let accountTokenInfo = atob(accountToken).split(":");
          if (accountTokenInfo[0] != this.auth.getCurrentUser().userId) {
            // check if account token not belongs to current user
            this.toastr.warning(
              this.translationServices.translate(
                "Please select account number"
              ),
              ""
            ); // prompt msg
            this.router.navigate(["/manageaccount"]); // redirect user to manage account
            return true;
          } else {
            return true; // if yes
          }
        }
      } else {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    } else if (state.url == "/view-all-complaints") {
      if (this.auth.isLoggedIn()) {
        // check if user is logged in.
        let accountToken = this.helpers.getLocalStoragData("accountToken"); // cehck if account token is exists
        if (accountToken == null) {
          this.toastr.warning(
            this.translationServices.translate("Please select account number"),
            ""
          ); // prompt msg
          // if not
          this.router.navigate(["/manageaccount"]); // redirect user to manage account
          return true;
        } else {
          let accountTokenInfo = atob(accountToken).split(":");
          if (accountTokenInfo[0] != this.auth.getCurrentUser().userId) {
            // check if account token not belongs to current user
            this.toastr.warning(
              this.translationServices.translate(
                "Please select account number"
              ),
              ""
            ); // prompt msg
            this.router.navigate(["/manageaccount"]); // redirect user to manage account
            return true;
          } else {
            return true; // if yes
          }
        }
      } else {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    } else if (state.url == "/billing") {
      // for other page pages
      if (this.auth.isLoggedIn()) {
        // if user is logged in ?
        let accountToken = this.helpers.getLocalStoragData("accountToken"); // cehck if account token is exists
        if (accountToken == null) {
          this.toastr.warning(
            this.translationServices.translate("Please select account number"),
            ""
          ); // prompt msg
          // if not
          this.router.navigate(["/manageaccount"]); // redirect user to manage account
          return true;
        } else {
          // else account token found then
          let accountTokenInfo = atob(accountToken).split(":");
          if (accountTokenInfo[0] != this.auth.getCurrentUser().userId) {
            this.toastr.warning(
              this.translationServices.translate(
                "Please select account number"
              ),
              ""
            ); // prompt msg
            // check if account token not belongs to current user
            this.router.navigate(["/manageaccount"]); // redirect user to manage account
            return true;
          } else {
            return true; // if yes
          }
        }
      } else {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    } else if (state.url == "/profile") {
      // for other page pages
      if (this.auth.isLoggedIn()) {
        // if user is logged in ?
        let accountToken = this.helpers.getLocalStoragData("accountToken"); // cehck if account token is exists
        if (accountToken == null) {
          this.toastr.warning(
            this.translationServices.translate("Please select account number"),
            ""
          ); // prompt msg
          // if not
          this.router.navigate(["/manageaccount"]); // redirect user to manage account
          return true;
        } else {
          // else account token found then
          let accountTokenInfo = atob(accountToken).split(":");
          if (accountTokenInfo[0] != this.auth.getCurrentUser().userId) {
            this.toastr.warning(
              this.translationServices.translate(
                "Please select account number"
              ),
              ""
            ); // prompt msg
            // check if account token not belongs to current user
            this.router.navigate(["/manageaccount"]); // redirect user to manage account
            return true;
          } else {
            return true; // if yes
          }
        }
      } else {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    } else if (state.url == "/notifications") {
      // for other page pages
      if (this.auth.isLoggedIn()) {
        // if user is logged in ?
        let accountToken = this.helpers.getLocalStoragData("accountToken"); // cehck if account token is exists
        if (accountToken == null) {
          this.toastr.warning(
            this.translationServices.translate("Please select account number"),
            ""
          ); // prompt msg
          // if not
          this.router.navigate(["/manageaccount"]); // redirect user to manage account
          return true;
        } else {
          // else account token found then
          let accountTokenInfo = atob(accountToken).split(":");
          if (accountTokenInfo[0] != this.auth.getCurrentUser().userId) {
            this.toastr.warning(
              this.translationServices.translate(
                "Please select account number"
              ),
              ""
            ); // prompt msg
            // check if account token not belongs to current user
            this.router.navigate(["/manageaccount"]); // redirect user to manage account
            return true;
          } else {
            return true; // if yes
          }
        }
      } else {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    } else {
      // for other page pages
      if (this.auth.isLoggedIn()) return true;
      this.router.navigate(["/login"], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
  }
}
