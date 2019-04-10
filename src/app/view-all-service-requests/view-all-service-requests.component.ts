import { DashboardService } from './../services/dashboard/dashboard.service';
import { ViewAllServiceRequestsService } from './../services/view-all-service-requests/view-all-service-requests.service';
import { HelpersService } from "./../services/helpers/helpers.service";
import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { Router } from "@angular/router";
import { TranslationService } from "../services/translation/translation.service";

@Component({
  selector: 'app-view-all-service-requests',
  templateUrl: './view-all-service-requests.component.html',
  styleUrls: ['./view-all-service-requests.component.css']
})
export class ViewAllServiceRequestsComponent implements OnInit {
  serviceRequestLoder: any = false;
  ServiceRequestFound = false;
  ServiceRequests: any = "";
  dispString = "";
  accountNumber
  constructor(
    private viewAllServiceRequests: ViewAllServiceRequestsService,
    private toastr: ToastrService,
    private router: Router,
    private helper: HelpersService,
    private DashboardService:DashboardService,
    private translationServices: TranslationService

  ) {}
  ngOnInit() {
    let accountToken = atob(this.helper.getLocalStoragData("accountToken")); // fetch account number.
    let accountTokenInfo = accountToken.split(":");
    this.accountNumber = accountTokenInfo[1]; //account Number
    this.dispString =  this.translationServices.translate("accountnumber")+" ( " + this.accountNumber + " ) ";
    this.getServiceRequest();
   
  }
  getServiceRequest() {
    this.serviceRequestLoder = true;
    this.DashboardService.getServiceRequest(
      this.accountNumber,
      (result: any) => {
        this.serviceRequestLoder = false;
        console.log(result);
        if (result.authCode == "200" && result.data_params.length > 0) {
          this.ServiceRequests = result.data_params;
          this.ServiceRequestFound = true;
        } else {
          this.ServiceRequests = "";
          this.ServiceRequestFound = false;
        }
      }
    );
  }
  
  redirectoRequestDetails(requestRecId) {
    var serviceRequestId=btoa(requestRecId);
    this.router.navigate(['/service-request-details'],{ queryParams: { serviceReq: serviceRequestId } });
  }
}
