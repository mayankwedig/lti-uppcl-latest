import { HelpersService } from "./../services/helpers/helpers.service";
import { Component, OnInit } from "@angular/core";
import { HomeService } from "../services/home/home.service";
import { environment } from "../../environments/environment";
import { IconsService } from "../services/icons/icons.service";
import { Router } from "@angular/router";
require("../../assets/js/owl.carousel.js");

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
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
  redirectLoding = false;
  /** Redirection Loder*/
  /*  redirectLoding = false;
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
  }; */
  constructor(
    private homeService: HomeService,
    private helpers: HelpersService,
    private icones: IconsService,
    private router:Router
  ) {
    /* this.getLatestNews(); */
  }
  latestNewsLoader: boolean = false;
  latestNews: any = [];
  ministerLoader: boolean = false;
  ministermsg: any = [];
  impLinkLoader: boolean = false;
  impLinks: any = [];

  missionVisionLoader: boolean = true;
  missionVisionData: any = [];
  missionVisionFound: boolean = false;
  headerIcons: any = null;
  getIcones() {
    this.headerIcons = null;
    if (this.helpers.getLocalStoragData("icons") == null) {
      this.icones.getIcons().subscribe(
        (response: any) => {
          if (response.authCode == "200" && response.status == true) {
            this.helpers.setLocalStoragData(
              "icons",
              JSON.stringify(response.data_params)
            );
            this.headerIcons = JSON.parse(this.helpers.getLocalStoragData("icons"));
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
              this.headerIcons = JSON.parse(this.helpers.getLocalStoragData("icons"));
            }
          },
          error => {}
        );
      }else{
        this.headerIcons=JSON.parse(this.helpers.getLocalStoragData("icons"));
      }
      
    }
   
  }
  setIconeImage(index) {
    if (this.headerIcons != null) {
      let image = environment.icon_img + this.headerIcons[index];
      if (image) {
        return image;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
  ngOnInit() {
    this.getIcones();
    this.latestNewsLoader = true;
    this.getLatestNews();
    this.getMinisterMessage();
    this.getImportantLink();
    this.getMissionAndVision();
  }

  getLatestNews() {
    this.latestNewsLoader = true;
    var header = {
      supplyType: "latest_news"
    };
    this.homeService.getMasterData(header).subscribe(
      (response: any) => {
        this.latestNewsLoader = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.latestNews = res.data_params;
          } else {
            this.latestNews = [];
          }
        }
      },
      error => {
        this.redirectLoding = false;
        this.latestNewsLoader = false;
        this.latestNews = [];
        throw error;
      }
    );
  }

  getMissionAndVision() {
    this.missionVisionLoader = true;
    this.homeService.getMissionandVision().subscribe(
      (response: any) => {
        this.missionVisionLoader = false;
        this.redirectLoding = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.missionVisionData = res.data_params;
            this.missionVisionFound = true;
            console.log(res.data_params);
          } else {
            this.missionVisionData = [];
            this.missionVisionFound = false;
          }
        }
      },
      error => {
        this.redirectLoding = false;
        this.missionVisionFound = false;
        this.missionVisionLoader = false;
        this.missionVisionData = [];
        throw error;
      }
    );
  }

  ministerDataFound: boolean = false;
  getMinisterMessage() {
    this.ministerLoader = true;

    this.homeService.getMinisterdata().subscribe(
      (response: any) => {
        this.ministerLoader = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.ministermsg = res.data_params;
            /*  console.log(this.ministermsg); */
            this.ministerDataFound = true;
          } else {
            this.ministermsg = [];
            this.ministerDataFound = false;
          }
        }
      },
      error => {
        this.redirectLoding = false;
        this.ministerDataFound = false;
        this.ministerLoader = false;
        this.ministermsg = [];
        throw error;
      }
    );
  }

  getImportantLink() {
    this.impLinkLoader = true;
    this.homeService.getImportantLink().subscribe(
      (response: any) => {
        this.impLinkLoader = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.impLinks = res.data_params;
          } else {
            this.impLinks = [];
          }
        }
      },
      error => {
        this.redirectLoding = false;
        this.impLinkLoader = false;
        this.impLinks = [];
        throw error;
      }
    );
  }
  getImages(imageData) {
    var imgInfo = imageData;
    var imgUrl = environment.no_image;
    var pic = imgInfo.display_picture;
    if (pic != "") {
      imgUrl = environment.missionImage + "/" + imgInfo.id + "/" + pic;
    }
    return imgUrl;
  }
}
