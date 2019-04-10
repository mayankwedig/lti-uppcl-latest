import { SideBarService } from "./../services/side-bar/side-bar.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { AuthService } from "./../services/authService/auth.service";
import { Component, OnInit, Input, AfterViewInit,ElementRef,NgZone} from "@angular/core";
import { DataService } from "../services/data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { WindowRefService } from "../services/window-ref/window-ref.service";
import { ManageaccountService } from "./../services/manageaccount/manageaccount.service";
import { DashboardService } from "./../services/dashboard/dashboard.service";

import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { TranslationService } from "../services/translation/translation.service";
import { ToastrService } from "ngx-toastr";

import { environment } from "../../environments/environment";

import * as $ from "jquery";
@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  styleUrls: ["./side-bar.component.css"]
})
export class SideBarComponent implements OnInit {
  @Input("displayUserInfo") displayUserInfo: any;
  currentUrl: any = "";
  account_no;
  userName;
  dashboardDataApiUrl = "users/getUserData";
  is_net_metering: boolean = false; // by Default Net metering will be 0
  userData = "";
  accountLoder: boolean = false;
  accountData = "";
  isAccountDataFound: boolean = false;
  accountNumber = "";
  constructor(
    private helpers: HelpersService,
    private dataservice: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private winRef: WindowRefService,
    private auth: AuthService,
    private accountServices: ManageaccountService,
    private toastr: ToastrService,
    private Dashboard: DashboardService,
    private translationServices: TranslationService,
    private sideBarService: SideBarService,
    private el: ElementRef,
    private zone: NgZone
  ) {}

  icone_image = environment.icon_img;

  // changes By chandni only $ remove
  getIconeImage(imageData, type) {
    if (type == "normal") {
      if (imageData.image != null) {
        return environment.icon_img + imageData.id + "/" + imageData.image;
      } else {
        return null;
      }
    } else {
      if (imageData.hover_image != null) {
        return (
          environment.icon_img + imageData.id + "/" + imageData.hover_image
        );
      } else {
        return null;
      }
    }
  }

  removeCss(idValue) {
      $("li").removeClass("openDropdown");
      $("#li" + idValue).addClass("openDropdown");
      $("#li" + idValue).removeClass("open");
    }
  isSidebarMenusFound: boolean = true;
  sideBarMenuLoader: boolean = false;
  sideBarMenus: any = [];
  filterBy(prop: string) {
    return this.sideBarMenus.sort((a, b) =>
      a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1
    );
  }

 /*  ngAfterViewInit(){
  
    var init = [];
      this.winRef.nativeWindow.PixelAdmin.start();
      try{
        this.winRef.nativeWindow.PixelAdmin.initPlugin("main_menu", new this.winRef.nativeWindow.PixelAdmin.MainMenu);
        
      }catch(e){
      }
  } */
  getSideBarMenus() {
    this.sideBarMenuLoader = true;
    this.sideBarService.getSideBarMenus().subscribe(
      (response: any) => {
        this.sideBarMenuLoader = false;
        if (
          response.authCode == "200" &&
          response.status == true &&
          response.data_params.length > 0
        ) {
          this.sideBarMenus = response.data_params;
          this.isSidebarMenusFound = true;
        } else {
          this.isSidebarMenusFound = false;
          this.sideBarMenus = [];
        }
      },
      error => {
        this.sideBarMenuLoader = false;
        this.isSidebarMenusFound = false;
        this.sideBarMenus = [];
      }
    );
  }
  isDispalyable(menu) {
    if (menu.slug == "billing") {
      // if billing
      if (this.selectedAccountData.isPrepaid == "No") {
        return true;
      } else {
        return false;
      }
    } else if (menu.slug == "recharge-history") {
      // if recharge history
      if (this.selectedAccountData.isPrepaid == "Yes") {
        return true;
      } else {
        return false;
      }
    }else if (menu.slug == "pay-bill") {
      // if recharge history
      if (!(this.selectedAccountData.isPrepaid == "Yes")) {
        return true;
      } else {
        return false;
      }
    }else if (menu.slug == "net-metering") {
      // if net metering
      if (this.is_net_metering) {
        return true;
      } else {
        return false;
      }
    }else
    {
      return true;
    }
  }
  ngOnDestroy(){
    $("body").addClass("no-sidebar-menu");
    $("#main-menu-toggle2").hide();
  }
  ngOnInit() {
    $("#main-menu-toggle2").fadeIn(1);
    $("body").removeClass("no-sidebar-menu");
    let accountToken = this.helpers.getLocalStoragData("accountToken"); // cehck if account token is exists
    if (accountToken != null) {
      // If not null
      let accountTokenInfo = atob(accountToken).split(":"); // split token

      if (accountTokenInfo[0] == this.auth.getCurrentUser().userId) {
        this.accountNumber = accountTokenInfo[1];
        // if token of current user
        if (parseInt(accountTokenInfo[2]) == 1) {
          this.is_net_metering = true;
        } else {
          this.is_net_metering = false;
        }
      }
      this.selectedAccountDetails();
    }
   

    this.currentUrl = this.router.url.replace(/\//g, "");
    if (
      this.currentUrl.indexOf("serviceReq") !== -1 ||
      this.currentUrl == "new-service-connection" ||
      this.currentUrl == "view-all-service-request"
    ) {
      this.currentUrl = "service-request";
    } else if (
      this.currentUrl.indexOf("complaintReq") !== -1 ||
      this.currentUrl == "view-all-complaints"
    ) {
      this.currentUrl = "complaints";
    }

    this.userData = this.auth.getCurrentUser();
    this.getAccounts("");
    this.getSideBarMenus();
  }
  accountDetailsLoder: any = false;
  AccountDetailsFound: any = false;
  selectedAccountData: any = "";
  selectedAccountDetails() {
    this.Dashboard.getAccountDetails(this.accountNumber, (result: any) => {
      this.accountDetailsLoder = false;
      if (result.authCode == "200") {
        this.AccountDetailsFound = true;
        this.selectedAccountData = result.data_params;
      } else {
        this.AccountDetailsFound = false;
      }
    });
  }
  getAccounts(searchKeyWord) {
    this.accountLoder = true;

    this.accountServices.getAccount(searchKeyWord).subscribe(
      (response: any) => {
        var res = response;
        this.accountLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.accountData = res.data_params;
            this.isAccountDataFound = true;
          } else {
            this.toastr.error(
              this.translationServices.translate(res.msg),
              "failed!"
            );
            this.isAccountDataFound = false;
          }
        }
      },
      (error: AppError) => {
        this.isAccountDataFound = false;
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

  redirectoDashBoard(accountId, userId) {
    this.redirectLoding = true; // make loder true
    var userId = this.auth.getCurrentUser().userId;
    var is_net_metering = 0;
    //fetching Account details for getting net metering is on/off
    this.Dashboard.getAccountDetails(accountId, (result: any) => {
      this.redirectLoding = false;
      if (result.authCode == "200") {
        is_net_metering = result.data_params.is_net_metering;
        this.helpers.setLocalStoragData(
          "accountToken",
          btoa(userId + ":" + accountId + ":" + is_net_metering)
        ); // set new account access token.
      } else {
        this.helpers.setLocalStoragData(
          "accountToken",
          btoa(userId + ":" + accountId + ":" + 0)
        ); // set new account access token.
      }
      this.currentUrl = this.router.url;
      if (this.currentUrl.indexOf("dashboard") !== -1) {
        /*  this.currentUrl="/redirect-dashboard"; */
        this.router.navigate(["/redirect-dashboard"]);
      } else {
        this.router.navigate(["/dashboard"]); //redirect user to dashboard.
      }
    });
  }
  logout() {
    this.auth.logout();
  }
}
