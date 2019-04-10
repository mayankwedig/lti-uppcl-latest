import { AdvertisementService } from "./../services/advertisement/advertisement.service";
import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { environment } from "../../environments/environment";
declare var _googCsa: any;
@Component({
  selector: "app-advertisement",
  templateUrl: "./advertisement.component.html",
  styleUrls: ["./advertisement.component.css"]
})
export class AdvertisementComponent implements OnInit, AfterViewInit {
  @Input("adQuery") adQuery: any;

   adLoader: boolean = false;
   adData: any = [];
   isAdFound: boolean = false;
   adFetchQuery: any = { slug: "dashboard" };
  adimagurl: string = "";
  isGoogleAd=false;

  constructor(private _ad: AdvertisementService) {}

  ngAfterViewInit() {
    
    this.getadvertisementData(this.adFetchQuery);
  }
  ngOnInit() {
    this.adFetchQuery["slug"] = this.adQuery;
    this.adimagurl = environment.adimageUrl;
    this.isAdFound=false;
    this.adLoader=true;
    this.adData = [];
  }
  
  getadvertisementData(adFetchQuery) {
    this.adData = [];
    this._ad.getAds(adFetchQuery).subscribe(
      (response: any) => {
        var res = response;
        this.adLoader = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.adData = res.data_params;
            if(this.adData[0].query != null && this.adData[0].type && this.adData[0].public_id != null){
                this.isGoogleAd=true;
                environment.ads.options.pubId=this.adData[0].public_id;
                environment.ads.options.query=this.adData[0].query;
                var pageOptions = environment.ads.options;
                var adblock1 = environment.ads.adblock;
                _googCsa("ads", pageOptions, adblock1);
            }else{
              this.isGoogleAd=false;
            }
            this.isAdFound = true;
          } else {
            this.isAdFound = false;
            this.adData = [];
          }
        }
      },
      (error: AppError) => {
        this.isAdFound = false;
        this.adLoader = false;
        this.adData = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
}
