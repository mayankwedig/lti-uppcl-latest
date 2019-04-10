import { HelpersService } from './../services/helpers/helpers.service';
import { AuthService } from './../services/authService/auth.service';
import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-change-password-without-login',
  templateUrl: './change-password-without-login.component.html',
  styleUrls: ['./change-password-without-login.component.css']
})
export class ChangePasswordWithoutLoginComponent implements OnInit {

  constructor(private _auth:AuthService,private router:Router,private helpersService:HelpersService) { }

  ngOnInit() {
    if(this._auth.isLoggedIn()){ // if user is alreday logged in then redirect to logged-in change password page
      this.router.navigate(["/change-password"]);
    }else{
      if (this.helpersService.getLocalStoragData("changeExpPassword") == null) { // if change password session is not set then redirect to login page.
        this.router.navigate(["/login"]);
      }
    }
  }

}
