import { Component, OnInit } from "@angular/core";
import { HelpersService } from "./../services/helpers/helpers.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"]
})
export class ResetPasswordComponent implements OnInit {
  accountNumber: any = "";
  dispString = "";
  constructor(private helpers: HelpersService,private router:Router) {}
  ngOnInit() {
    if (this.helpers.getLocalStoragData("changeExpPassword") != null) { // if change password session is not set then redirect to login page.
        this.router.navigate(["/change-expired-password"]);
    }
    let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
    let accountTokenInfo = accountToken.split(":");
    this.accountNumber = accountTokenInfo[1]; //account Number
    this.dispString = "Account No. ( " + this.accountNumber + " ) ";
  }
}
