import { environment } from 'src/environments/environment';
import { Component, OnInit } from "@angular/core";
import { DownloadsService } from "../services/downloads/downloads.service";


@Component({
  selector: "app-download",
  templateUrl: "./download.component.html",
  styleUrls: ["./download.component.css"]
})
export class DownloadComponent implements OnInit {
  constructor(private _downloadSerivce: DownloadsService) {}
  downloadsLoader: boolean = false;
  downloadsDataFound: boolean = false;

  downloadsdData: any = [];
  
  ngOnInit() {
    this.downloads();
  }

  setUrl(dataValue){
    let urlPathDownload=dataValue.uploaded_file.split("/"); // getting url path
    let Image=urlPathDownload[(urlPathDownload.length)-1]; // creating url path
    return environment.download+dataValue.id+"/"+Image;
  }
  downloads() {
    this.downloadsLoader = true;
    this.downloadsdData=[];
    this._downloadSerivce.getDownloadsdata().subscribe(
      (response: any) => {
        this.downloadsLoader = false;
        
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.downloadsdData = res.data_params;
            this.downloadsDataFound = true;
          } else {
            this.downloadsdData = [];
            this.downloadsDataFound = false;
          }
        }
      },
      error => {
        this.downloadsDataFound = false;
        this.downloadsLoader = false;
        this.downloadsdData = [];
        throw error;
      }
    );
  }
}
