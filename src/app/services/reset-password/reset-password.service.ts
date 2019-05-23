import { HelpersService } from "./../helpers/helpers.service";
import { AuthService } from "./../authService/auth.service";
import { DataService } from "./../data.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ResetPasswordService {
  resetPasswordAPI = "users/resetPassword";
  constructor(
    private _dataService: DataService,
    private _auth: AuthService,
    private helper: HelpersService
  ) {}
  resetPassword(data_object) {
    if (this._auth.isLoggedIn()) {
      return this._dataService.create(
        this.resetPasswordAPI,
        data_object,
        this.helper.setHeaderData()
      );
    } else {
      return this._dataService.create(
        "users/resetPasswordWithoutLogin",
        data_object,
        ""
      );
    }
  }
}
