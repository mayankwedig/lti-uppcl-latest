import { DashboardService } from "./../services/dashboard/dashboard.service";
import { ComplaintsService } from "./../services/complaints/complaints.service";
import { AuthService } from "./../services/authService/auth.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { TranslationService } from "../services/translation/translation.service";

@Component({
  selector: "app-complaint-request-details",
  templateUrl: "./complaint-request-details.component.html",
  styleUrls: ["./complaint-request-details.component.css"]
})
export class ComplaintRequestDetailsComponent implements OnInit {
  accountNumber = "";
  dispString: any = "";
  serviceTokenNumber: any = "";

  constructor(
    private fb: FormBuilder,
    private helpers: HelpersService,
    private toastr: ToastrService,
    private AuthService: AuthService,
    private SerivceRequest: ComplaintsService,
    private DashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router,
    private translationServices: TranslationService
  ) {}

  ngOnInit() {
    if (this.route.snapshot.queryParams.complaintReq != null) {
      this.serviceTokenNumber = this.route.snapshot.queryParams.complaintReq;
      if(this.isLoggedIn()){
        if (this.helpers.getLocalStoragData("accountToken") != null) {
          let accountToken = atob(
            this.helpers.getLocalStoragData("accountToken")
          ); // fetch account number.
          let accountTokenInfo = accountToken.split(":");
          this.accountNumber = accountTokenInfo[1]; //account Number
          this.dispString =
            this.translationServices.translate("accountnumber") +
            " ( " +
            this.accountNumber +
            " ) ";
          //this.showAccountDetails(this.accountNumber); // if account no is already selected then show details of selected account.
        } else {
          this.AuthService.getCurrentUser();
          this.dispString =
            "User Name ( " + this.AuthService.getCurrentUser().username + " ) ";
          //this.initServiceRequestFrm(this.selectedRequestType); // init form
        }
       
        this.showAccountDetails(this.accountNumber);
        this.getComplaintRequestDetails();
      }else{
        this.getComplaintRequestDetails();
      }
    } else {
      if(this.isLoggedIn()){
      this.router.navigate(["/view-all-service-request"]);
      }else{
        this.toastr.warning(this.translationServices.translate("No complaint found,Please submit complaint"),this.translationServices.translate("Faild"));
        this.router.navigate(["/complaints"]);  
      } 
    }
  }

  accountDetailsLoder: boolean = false;
  name = "";
  installationAddress = "";
  currentLoad = "";
  supplyType = "";
  mobileNumber = "";
  emailId = "";

  isLoggedIn() {
    return this.AuthService.isLoggedIn();
  }
  showAccountDetails(accNo) {
    this.accountDetailsLoder = true;
    this.DashboardService.getAccountDetails(accNo, (result: any) => {
     console.log(result);
      this.accountDetailsLoder = false;
      if (result.authCode == "200") {
        this.accountNumber = accNo;
        var accountDetails = result.data_params;
        this.name = accountDetails.account_name;
        this.installationAddress = accountDetails.premise_address;
        this.currentLoad = accountDetails.current_load;
        this.supplyType = accountDetails.supply_type;
        this.mobileNumber = accountDetails.mobile;
        this.emailId = accountDetails.email;
      } else {
      }
    });
  }

  getSerReqDtLoder: boolean = false;
  complaintsDetails: any = {};
  getComplaintRequestDetails() {
    var requestData = {};
    if(this.AuthService.isLoggedIn()){
      requestData = {
        accountToken: btoa(this.accountNumber),
        complaintToken: this.serviceTokenNumber
      };
    }else{
      requestData = {complaintToken: this.serviceTokenNumber};
    }
    this.getSerReqDtLoder = true;
    
    this.SerivceRequest.getComplaintRequestDetails(requestData).subscribe(
      (response: any) => {
        var res = response;
        this.getSerReqDtLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            
            this.complaintsDetails = res.data_params;
            if(!this.AuthService.isLoggedIn()){
              this.showAccountDetails(this.complaintsDetails.account_number)
            }
          } else {
            if(!this.AuthService.isLoggedIn()){
              this.toastr.warning(this.translationServices.translate("No complaint found,Please submit complaint"),this.translationServices.translate("Faild"));
              this.router.navigate(["/complaints"]);  
            }
            this.complaintsDetails = {};
          }
        }
      },
      (error: AppError) => {
        this.getSerReqDtLoder = false;
        this.complaintsDetails = {};
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
}
