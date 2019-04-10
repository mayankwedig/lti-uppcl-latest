import { AuthService } from "./../services/authService/auth.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { ComplaintsService } from "./../services/complaints/complaints.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { TranslationService } from "../services/translation/translation.service";

import {environment} from "./../../environments/environment";
import { Router } from "@angular/router";


@Component({
  selector: 'app-track-service-request',
  templateUrl: './track-service-request.component.html',
  styleUrls: ['./track-service-request.component.css']
})

export class TrackServiceRequestComponent implements OnInit {
  
  fetchAdQuery="profile";
  
  serviceRequestFrm: FormGroup;
  trackServiceReqLoader:boolean=false;
  adimagurl=environment.adimageUrl;
  constructor(
    private fb: FormBuilder,
    private helpers: HelpersService,
    private toastr: ToastrService,
    private complaints: ComplaintsService,
    private AuthService: AuthService,
    private translationServices: TranslationService,
    private auth: AuthService,
    private router: Router,

  ) {}

  ngOnInit() {
    if(this.auth.isLoggedIn()){
      this.router.navigate(["/service-request"])
    }
    this.initTrackComplaitnsFrm();
  
    
  }
 
 
  isLoggedIn(){
    return this.auth.isLoggedIn();
  }
  initTrackComplaitnsFrm() {
    var fields={
      serviceReqNo: ["", Validators.required],
     
    };
    this.serviceRequestFrm = this.fb.group(fields);
  }
  redirectoRequestDetails(requestRecId) {
    var serviceRequestId=btoa(requestRecId);
    this.router.navigate(['/service-request-details'],{ queryParams: { serviceReq: serviceRequestId } });
  }
  serviceRequestfunc(){
    this.serviceRequestFrm = this.helpers.markAsTouched(this.serviceRequestFrm);
    if (this.serviceRequestFrm.status != "INVALID") {
     var serviceReqNo=this.serviceRequestFrm.value.serviceReqNo;
      this.redirectoRequestDetails(serviceReqNo);
    }else{
      this.toastr.warning(this.translationServices.translate("Please fill all required fields"), "Failed!");
    }
  }
  get f() {
    return this.serviceRequestFrm.controls;
  }
}
