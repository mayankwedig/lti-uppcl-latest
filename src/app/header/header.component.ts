import { IconsService } from "./../services/icons/icons.service";
import { WindowRefService } from "./../services/window-ref/window-ref.service";
import { NotificationsService } from "./../services/notifications/notifications.service";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { ProfileService } from "./../services/profile/profile.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { Component, OnInit,ChangeDetectorRef,AfterViewInit} from '@angular/core';
import { AuthService } from "../services/authService/auth.service";
import { DataService } from "../services/data.service";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "constants";
import { Router,ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";
import { SiteSettingsService } from "../services/site-settings/site-settings.service";



declare var $: any;
require("../../assets/js/owl.carousel.js");
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, AfterViewInit {
  
  
 
  constructor(
    private winRef: WindowRefService,
    private icones: IconsService,
    public router: Router,
    public notificationsService: NotificationsService,
    public auth: AuthService,
    public dataservice: DataService,
    private helpers: HelpersService,
    private profile: ProfileService,
    private siteSettings:SiteSettingsService,
    private activatedRoute:ActivatedRoute,
    
  ) {}
  toggleDiv(){
    var self = $(".toggleClick").parent();
    self.toggleClass("open");
  }
  searchKeyWord = "";
  dashboardDataApiUrl = "users/getUserData";
  userName;
  userEmail;
  accountNumber = "";
  notificationLoder: boolean = true;
  notifications: any = [];
  totalNotifications: any = 0;
  hideTotalNotification: boolean = true;
  selected_lang = "eng"; //sessionStorage.getItem("selected_lag");
  logogImage = "";
  doSearch() {
    if (this.searchKeyWord != "") {
      this.router.navigate(["/search"],{ queryParams: { keyword: this.searchKeyWord } });
    }
  }
  headerIcons: any = null;
  checkSearcSring(){
    let searchKeyWord=this.activatedRoute.snapshot.queryParamMap.get("keyword");
    if(searchKeyWord){
      this.searchKeyWord=searchKeyWord;
    }
  }

  changeNavBar(){
    $("body").toggleClass("mme");
  }
  
  ngOnDestroy(){
    $("body").removeClass("mme");
  }
  
  getIcones() {
      
    this.headerIcons=null;
    if (this.helpers.getLocalStoragData("icons") == null) {
      this.icones.getIcons().subscribe(
        (response: any) => {
          if (response.authCode == "200" && response.status == true) {
            this.helpers.setLocalStoragData(
              "icons",
              JSON.stringify(response.data_params)
            );
            this.headerIcons=JSON.parse(this.helpers.getLocalStoragData("icons"));
          }
        },
        error => {}
      );
    } else {
      if (this.router.url == "/") {
        this.icones.getIcons().subscribe(
          (response: any) => {
            if (response.authCode == "200" && response.status == true) {
              this.helpers.setLocalStoragData(
                "icons",
                JSON.stringify(response.data_params)
              );
              this.headerIcons=JSON.parse(this.helpers.getLocalStoragData("icons"));
            }
          },
          error => {}
        );
      }else{
        this.headerIcons=JSON.parse(this.helpers.getLocalStoragData("icons"));
      }
    }
    
  }
    setIconeImage(index){
          if(this.headerIcons != null){
            let image=environment.icon_img+this.headerIcons[index];
              if(image){
                return image;
              }else{
                return null;
              }
          }else{
            return null;
          }
        }
        isLoggedIn(){
          return this.auth.isLoggedIn();
        }
  ngOnInit() {
  
    this.checkSearcSring();
    this.getIcones();
    this.getSiteLogo();
    if (sessionStorage.getItem("selected_lag") == null) {
      sessionStorage.setItem("selected_lag", this.selected_lang);
    } else {
      this.selected_lang = sessionStorage.getItem("selected_lag");
    }
    let accountToken = this.helpers.getLocalStoragData("accountToken"); // cehck if account token is exists
    if (accountToken != null) {
      // If not null
      let accountTokenInfo = atob(accountToken).split(":"); // split token
      if (accountTokenInfo[0] == this.auth.getCurrentUser().userId) {
        this.accountNumber = accountTokenInfo[1];
        if (this.auth.getCurrentUser().username != null) {
          this.userName = this.auth.getCurrentUser().username;
        }
        this.getProfile();
        // if token of current user
        /*  if (parseInt(accountTokenInfo[2]) == 0) {
          this.is_net_metering = false;
        } else {
          this.is_net_metering = true;
        } */
      }
    } else {
      if (this.isLoggedIn()) {
        if (this.auth.getCurrentUser().username != null) {
          this.userName = this.auth.getCurrentUser().username;
        }
        
      }
      if(this.isLoggedIn()){
        this.getLimitedNotifications();
      }
    }
    
  }
  setSiteLogo(){
    let SiteLogo=this.siteSettings.getSiteSettings().home_logo;
    this.logogImage=  environment.logoUrl+SiteLogo; 
  }
  getSiteLogo() {
    this.logogImage = environment.logo_not_found;
      if(this.siteSettings.getSiteSettings() == null){
        this.siteSettings.getSiteSettingsAPI().subscribe(
          (result: any) => {
            if (result.authCode == 200 && result.status) {
              if (result.home_logo != "") {
                this.siteSettings.setSiteSettingsSession(result.data_params);
                  this.setSiteLogo();
              } else {
                this.logogImage = environment.logo_not_found;
              }
            }
          },
          (error: AppError) => {
            this.logogImage = environment.logo_not_found;
            if (error instanceof BadInput) {
            } else {
              throw error;
            }
          }
        );
      }else{
        this.setSiteLogo();
      }
    
  }
  loderLoder = false;
  profile_image: any = "../assets/images/placeholder-man-grid-240x268.png";
  changeLang(changeLang) {
    sessionStorage.setItem("selected_lag", changeLang);
    /* this.ngOnInit(); */
    this.onRefresh();
  }
  onRefresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    let currentUrl = this.router.url;

    if (currentUrl == "/") {
      this.winRef.nativeWindow.location = this.helpers.getSiteUrl() + "/home";
    } else {
      this.winRef.nativeWindow.location =
        this.helpers.getSiteUrl() + currentUrl;
    }

    /* this.router.navigateByUrl(currentUrl)
      .then(() => {
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
      }); */
  }
  getProfile() {
    this.loderLoder = true;
    this.profile.getProfile(this.accountNumber).subscribe(
      (response: any) => {
        var res = response;
        this.loderLoder = false;

        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            var profileData = res.data_params;
            this.profile_image = profileData.profile_image;
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
  ngAfterViewInit() {
    $(function() {
      $("#main-navbar-notifications").slimScroll({
        height: 250,
        color: "#1d9455",
        opacity: 1,
        size: "15px"
      });
    });
  }

  getLimitedNotifications() {
    var limited = true;
    this.notificationsService.getNotifications(limited).subscribe(
      (response: any) => {
        var res = response;
        this.notificationLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.totalNotifications = res.data_params.length;
            this.hideTotalNotification = false;
            this.notifications = res.data_params;
          } else {
            this.notifications = [];
          }
        }
      },
      (error: AppError) => {
        this.notificationLoder = false;
        this.notifications = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
  funcHideNotification() {
    this.hideTotalNotification = true;
  }

  logout() {
    this.auth.logout();
    $("body").removeClass("mme");
    $("body").removeClass("animate-mm-lg");
    $("body").removeClass("animate-mm-md");
    $("body").removeClass("animate-mm-sm");
  }
}
