import { AuthService } from './../services/authService/auth.service';
import { Component, OnInit } from '@angular/core';
import { SiteSettingsService } from '../services/site-settings/site-settings.service';
import { BadInput } from "../common/bad-input";
import { AppError } from "../common/app-error";
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  socialLinks:any=null;
  setSocialLinks(){
    let facebook_link=this.siteSettings.getSiteSettings().facebook_link;
        let google_plus=this.siteSettings.getSiteSettings().google_plus;
        let linkdin_link=this.siteSettings.getSiteSettings().linkdin_link;
        let twitter=this.siteSettings.getSiteSettings().twitter;
        this.socialLinks={
          "facebook_link":facebook_link,
          "google_plus":google_plus,
          "linkdin_link":linkdin_link,
          "twitter":twitter
        }
  }
  GetSocialLinks() {
    
      if(this.siteSettings.getSiteSettings() == null){
        this.siteSettings.getSiteSettingsAPI().subscribe(
          (result: any) => {
            if (result.authCode == 200 && result.status) {
              if (result.home_logo != "") {
                this.siteSettings.setSiteSettingsSession(result.data_params);
                this.setSocialLinks();
              } else {
                this.socialLinks=null
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
      }else{
        this.setSocialLinks();
        
      }
    
  }
  constructor(private auth:AuthService,private siteSettings:SiteSettingsService) { }
  isLoggedIn(){
    return this.auth.isLoggedIn();
  }
  ngOnInit() {
    this.GetSocialLinks();
  }

}
