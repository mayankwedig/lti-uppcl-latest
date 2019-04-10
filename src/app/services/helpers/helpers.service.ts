import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
import { TranslationService } from "../translation/translation.service";
@Injectable()
export class HelpersService {
  constructor(private _translate?:TranslationService) {}
  // Marking form fileds as touched.
  markAsTouched(fg: FormGroup) {
    var resultArray = Object.keys(fg.controls).map(function(keys) {
      let person = keys;
      return person;
    });
    if (resultArray.length > 0) {
      resultArray.forEach(element => {
        fg.controls[element].markAsTouched();
      });
    }
    return fg;
  }
  // Some helper Functions
  setHeaderData(contentType = "application/json") {
    let headerData = new HttpHeaders();
    headerData = headerData.append("Content-Type", contentType);
    headerData = headerData.append("Access-Control-Allow-Origin", "token");
    headerData = headerData.append("token", this.getLocalStoragData("token"));
    /* headerData = headerData.append('Cache-control', 'no-cache');
    headerData = headerData.append('Cache-control', 'no-store');
    headerData = headerData.append('Expires', '0');
    headerData = headerData.append('Pragma', 'no-cache'); */
    return headerData;
  }
  getArray(length, callBack) {
    let value = [];
    for (let i = 0; i < length; i++) {
      value.push((i + 1).toString());
    }
    callBack(value);
  }
  daysInMonth(month, year) {
    let response = {};
    return new Promise((resolve, reject) => {
      var days = new Date(year, month, 0).getDate();
      this.getArray(days, (result: any) => {
        resolve(result);
      });
    });
  }
  getMonth(month) {
    let mon;
    return new Promise((resolve, reject) => {
      if (month == "JAN") mon = "01";
      if (month == "FEB") mon = "02";
      if (month == "MAR") mon = "03";
      if (month == "APR") mon = "04";
      if (month == "MAY") mon = "05";
      if (month == "JUN") mon = "06";
      if (month == "JUL") mon = "07";
      if (month == "AUG") mon = "08";
      if (month == "SEP") mon = "09";
      if (month == "OCT") mon = "10";
      if (month == "NOV") mon = "11";
      if (month == "DEC") mon = "12";

      resolve(mon);
    });
  }
  getLocalStoragData(value: string) {
    var val = value || "";
    return val != "" ? sessionStorage.getItem(val) : val;
  }
  setLocalStoragData(name: string, value: string) {
    sessionStorage.setItem(name, value);
    /*   var val=value||"";
    return val != "" ? sessionStorage.getItem(val):val; */
  }
  clearLocalStorateData(sessionName: string) {
    sessionStorage.removeItem(sessionName);
  }
  lat12Monts() {
    // This function is using for Consumption graph on Dash board.
    return new Promise((resolve, reject) => {
      var lat12MOn = [];
      var theMonths = new Array(
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
      );
      var today = new Date();
      var aMonth = today.getMonth() + 1;
      var i;
      for (i = 0; i < 12; i++) {
        lat12MOn.push(theMonths[aMonth]);
        /*  console.log(theMonths[aMonth]); //here you can do whatever you want... */
        aMonth++;
        if (aMonth > 11) {
          aMonth = 0;
        }
      }
      if (lat12MOn.length > 0) {
        resolve(lat12MOn);
      } else {
        reject(false);
      }
    });
  }
  getImages(imageData, componentName) {
    console.log(componentName);
    var imgInfo = imageData;
    var imgUrl = environment.no_image;
    var pic = imgInfo.display_picture;
    if (pic != "") {
      switch (componentName) {
        case "home": {
          imgUrl = environment.missionImage + "/" + imgInfo.id + "/" + pic;
          break;
        }
        case "home-imp-link-slider": {
          imgUrl =
            environment.importantLinksIcones + "/" + imgInfo.id + "/" + pic;

          break;
        }
        default: {
          imgUrl = environment.no_image;
          break;
        }
      }
    }
    return imgUrl;
  }
  translate(string:string){
    return this._translate.translate(string);
  }
  getSiteUrl():string{
    return environment.siteUrl;
  }
  
  
}
