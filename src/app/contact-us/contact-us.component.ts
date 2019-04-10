import { ContactUsService } from './../services/contact-us/contact-us.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';


declare var $: any;

require('../../assets/js/owl.carousel.js');

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
	impLinks:any=[];
  impLinkLoader:boolean=false;
  contactUsBanner:any="";
	getImportantLink() {
    this.impLinkLoader = true;
    this.contactService.getImportantLink().subscribe(
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
        this.impLinkLoader = false;
        this.impLinks = [];
        throw error;
      }
    );
  }
  contactUsConent:any="";
  contentLoader:boolean=false;
  isContentDataFound:boolean=false;
  constructor(public contactService:ContactUsService) { }
  getContactUsContent(){
    this.contentLoader=true;
    this.contactService.getContactUsContent()
    .subscribe((response:any) => {
      this.contentLoader=false;
      
      if(response.authCode == "200" && response.status == true){
        this.isContentDataFound=true;
        this.contactUsConent=response.data_params;
        if(this.contactUsConent.uploaded_file != null){
          this.contactUsBanner=environment.cms_img+this.contactUsConent.id+"/"+this.contactUsConent.uploaded_file
        }
        
      }else{
        this.isContentDataFound=false;
        this.contactUsConent="";
        this.contactUsBanner="";
      } 
    },(error)=>{
      this.isContentDataFound=false;
      this.contentLoader=false;
      this.contactUsConent="";
      this.contactUsBanner="";
    });
  }
  ngOnInit() {
    this.getContactUsContent();
		this.getImportantLink();
  }

}
