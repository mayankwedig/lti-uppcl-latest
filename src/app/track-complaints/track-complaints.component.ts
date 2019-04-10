import { DashboardService } from "./../services/dashboard/dashboard.service";
import { AuthService } from "./../services/authService/auth.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { ComplaintsService } from "./../services/complaints/complaints.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { TranslationService } from "../services/translation/translation.service";

import { Router } from "@angular/router";

@Component({
  selector: 'app-track-complaints',
  templateUrl: './track-complaints.component.html',
  styleUrls: ['./track-complaints.component.css']
})

export class TrackComplaintsComponent implements OnInit {
  trackComplaintFrm: FormGroup;
  trackCompLoader:boolean=false;
  fetchAdQuery="profile";
  constructor(
    private fb: FormBuilder,
    private helpers: HelpersService,
    private toastr: ToastrService,
    private complaints: ComplaintsService,
    private AuthService: AuthService,
    private DashboardService: DashboardService,
    private translationServices: TranslationService,
    private auth: AuthService,
    private router: Router,

  ) {}

  ngOnInit() {
    if(this.auth.isLoggedIn()){
      this.router.navigate(["/complaints"])
    }
    this.initTrackComplaitnsFrm();
  }

  isLoggedIn(){
    return this.auth.isLoggedIn();
  }
  initTrackComplaitnsFrm() {
    var fields={
      complaintNumber: ["", Validators.required],
     
    };
    this.trackComplaintFrm = this.fb.group(fields);
  }
  redirectoRequestDetails(requestRecId) {
    var serviceRequestId=btoa(requestRecId);
    this.router.navigate(['/complaint-request-details'],{ queryParams: { complaintReq: serviceRequestId } });
  }
  trackComplaintFunc(){
    this.trackComplaintFrm = this.helpers.markAsTouched(this.trackComplaintFrm);
    if (this.trackComplaintFrm.status != "INVALID") {
     var complaintNo=this.trackComplaintFrm.value.complaintNumber;
      this.redirectoRequestDetails(complaintNo);
    }else{
      this.toastr.warning(this.translationServices.translate("Please fill all required fields"), "Failed!");
    }
  }
  get f() {
    return this.trackComplaintFrm.controls;
  }
}
