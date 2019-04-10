import { FaqService } from './../services/faq/faq.service';
import { Component, OnInit } from '@angular/core';
import {  FormControl, Validators } from '@angular/forms';
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})

export class FaqComponent implements OnInit {
  constructor(private faq:FaqService) { }
   faqDataFound:boolean=false;
   faqLoader:boolean=false;
   faQData:any=[];
  ngOnInit() {
    this.faqLoader=true;
    this.faq.getFaq().subscribe((result:any)=>{
      this.faqLoader=false;
        if(result.authCode == 200 && result.status == true){
            this.faQData=result.data_params;
            this.faqDataFound=true;
        }else{
          this.faqDataFound=false;
        }
    }, (error: AppError) => {
      this.faqDataFound=false;
      if (error instanceof BadInput) {
      } else {
        throw error;
      }
    })
  }

}
