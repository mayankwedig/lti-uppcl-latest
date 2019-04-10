import { HelpersService } from './services/helpers/helpers.service';
import { Component, OnInit,HostListener} from '@angular/core';
import {WindowRefService} from './services/window-ref/window-ref.service';
import { fadeAnimation } from './animations';
import * as $  from "jquery";
import { IconsService } from './services/icons/icons.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    fadeAnimation
    // animation triggers go here
  ]
})
export class AppComponent implements OnInit {
 
  getIcones() {
    if (this.helpers.getLocalStoragData("icons") == null) {
      this.icones.getIcons().subscribe(
        (response: any) => {
          if (response.authCode == "200" && response.status == true) {
            this.helpers.setLocalStoragData(
              "icons",
              JSON.stringify(response.data_params)
            );
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
            }
          },
          error => {}
        );
      }
    }
  }
  prepareRoute(outlet: any) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
  title = 'lti';
  constructor(private winRef: WindowRefService,private helpers:HelpersService,private icones:IconsService,private router:Router){
    /* this.getIcones(); */
  }
 
  public ngOnInit(){
    var init=[];
    init.push(function () {
       
    });
   this.winRef.nativeWindow.PixelAdmin.start(init);
    
  }
}
