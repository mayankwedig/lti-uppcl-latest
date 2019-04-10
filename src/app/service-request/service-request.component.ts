
import { environment } from './../../environments/environment';
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { SerivceRequestService } from "./../services/service-request/serivce-request.service";
import { AuthService } from "./../services/authService/auth.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { TranslationService } from "../services/translation/translation.service";


@Component({
  selector: "app-service-request",
  templateUrl: "./service-request.component.html",
  styleUrls: ["./service-request.component.css"]
})
export class ServiceRequestComponent implements OnInit {
  fetchAdQuery="profile"//ad query
  requestServicesFrm: FormGroup;
  selectServiceRequestFrm: FormGroup;
  selectedRequestType: any = "";
  accountNumber = "";
  dispString: any = "";

  userAccounts: any = [];
  serviceRequestTypes: any = [];
  servReqEnclosedIdentifDocs: any = [];
  changeReasons: any = [];

  submitServiceRequestLoder: boolean = false;
  ChangeReasonsLoder: any = false;
  userAccountsLoder: boolean = false;
  serviceRequestTypeLoder: boolean = false;
  accountDetailsLoder: boolean = true;
  servReqEnclosedIdentifDocLoder: boolean = false;

  accountDetails: any = "";
  name: any = "";
  installationAddress: any = "";
  currentLoad: any = "";
  supplyType: any = "";
  mobileNumber: any = "";
  emailId: any = "";
  comments: any = "";
  showTrackingNo = false;
  hideServiceRequestDetailsFrm = true;
  constructor(
    private fb: FormBuilder,
    private helpers: HelpersService,
    private toastr: ToastrService,
    private AuthService: AuthService,
    private SerivceRequest: SerivceRequestService,
    private DashboardService: DashboardService,
    private translationServices: TranslationService

  ) {}
  
  ngOnInit() {
  
    this.hideServiceRequestDetailsFrm = true;
    this.getServReqEnclosedIdentifDoc();
    this.getServiceRequestType();
    this.getChangeReasons();
    this.getUserAccounts();
    if (this.helpers.getLocalStoragData("accountToken") != null) {
      let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
      let accountTokenInfo = accountToken.split(":");
      this.accountNumber = accountTokenInfo[1]; //account Number
      this.dispString =  this.translationServices.translate("accountnumber")+" ( " + this.accountNumber + " ) ";
      //this.showAccountDetails(this.accountNumber); // if account no is already selected then show details of selected account.
    } else {
      this.AuthService.getCurrentUser();
      this.dispString =
        "User Name ( " + this.AuthService.getCurrentUser().username + " ) ";
      //this.initServiceRequestFrm(this.selectedRequestType); // init form
    }
    this.initSelectServiceRequestFrm(this.selectedRequestType);
  }
  get f() {
    return this.requestServicesFrm.controls;
  }
  get fSelectRequ() {
    return this.selectServiceRequestFrm.controls;
  }
  initSelectServiceRequestFrm(selectedCaseType) {
    var fields = {
      accountNumber: [this.accountNumber, [Validators.required]],
      serviceRequestType: [selectedCaseType, [Validators.required]]
    };
    this.selectServiceRequestFrm = this.fb.group(fields);
    this.showAccountDetails(this.accountNumber);
  }
  submitSelectServiceRequestFrm() {
    this.selectServiceRequestFrm = this.helpers.markAsTouched(
      this.selectServiceRequestFrm
    );
    if (this.selectServiceRequestFrm.status != "INVALID") {
      this.accountNumber = this.selectServiceRequestFrm.value.accountNumber;
      this.selectedRequestType = this.selectServiceRequestFrm.value.serviceRequestType;
      this.hideServiceRequestDetailsFrm = false;
      this.initServiceRequestFrm(this.selectedRequestType);
    } else {
      this.toastr.warning(this.translationServices.translate("Please fill all required fields"), "Failed!");
    }
  }



  initServiceRequestFrm(selectedCaseType) {
    var fields = {
      accountNumber: [this.accountNumber, [Validators.required]],
      serviceRequestType: [selectedCaseType, [Validators.required]],
      name: [{ value: this.name, disabled: true }, [Validators.required]],
      installationAddress: [
        { value: this.installationAddress, disabled: true },
        [Validators.required]
      ],
      currentLoad: [
        { value: this.currentLoad, disabled: true },
        [Validators.required]
      ],
      supplyType: [
        { value: this.supplyType, disabled: true },
        [Validators.required]
      ],
      mobileNumber: [
        { value: this.mobileNumber, disabled: true },
        [Validators.required]
      ],
      emailId: [{ value: this.emailId, disabled: true }, [Validators.required]],
      comments: ["", [Validators.required]]
    };
    if (selectedCaseType == "Permanent Disconnection Request") {
      fields["enclosedIdentificationDocument"] = ["", [Validators.required]];
    }
    if (selectedCaseType == "Load Change Request") {
      fields["loadUnit"] = [
        { value: "KW", disabled: true },
        [Validators.required]
      ];
      fields["newLoad"] = ["", [Validators.required]];
    }
    if (selectedCaseType == "Category Change Request") {
      fields["proposedCategory"] = ["", [Validators.required]];
      fields["proposedSupplyCode"] = ["", [Validators.required]];
      fields["reason"] = ["", [Validators.required]];
    }
    if (selectedCaseType == "Transfer of Connection") {
      fields["applicantName"] = ["", [Validators.required]];
      fields["houseNumber"] = ["", [Validators.required]];
      fields["enclosedIdentificationDocument"] = ["", [Validators.required]];
    }
    this.requestServicesFrm = this.fb.group(fields);
  }
  getUserAccounts() {
    this.userAccountsLoder = true;
    this.SerivceRequest.getAccounts().subscribe(
      (response: any) => {
        this.userAccountsLoder = false;
        var res = response;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.userAccounts = res.data_params;
          } else {
            this.userAccounts = [];
          }
        }
      },
      error => {
        this.userAccountsLoder = false;
        this.userAccounts = [];
        throw error;
      }
    );
  }
  showAccountDetails(accNo) {
    this.accountDetailsLoder = true;
    this.DashboardService.getAccountDetails(accNo, (result: any) => {
      this.accountDetailsLoder = false;
      if (result.authCode == "200") {
        this.accountNumber = accNo;
        this.accountDetails = result.data_params;
        this.name = this.accountDetails.account_name;
        this.installationAddress = this.accountDetails.premise_address;
        this.currentLoad = this.accountDetails.current_load;
        this.supplyType = this.accountDetails.supply_type;
        this.mobileNumber = this.accountDetails.mobile;
        this.emailId = this.accountDetails.email;
        this.initServiceRequestFrm(this.selectedRequestType);
      } else {
        this.initServiceRequestFrm(this.selectedRequestType);
      }
    });
  }
  
  getServReqEnclosedIdentifDoc() {
    this.servReqEnclosedIdentifDocLoder = true;
    this.SerivceRequest.getServReqEnclosedIdentifDoc().subscribe(
      (response: any) => {
        var res = response;
        this.servReqEnclosedIdentifDocLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.servReqEnclosedIdentifDocs = res.data_params;
          } else {
            this.servReqEnclosedIdentifDocs = [];
          }
        }
      },
      (error: AppError) => {
        this.servReqEnclosedIdentifDocLoder = false;
        this.servReqEnclosedIdentifDocs = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }

  getChangeReasons() {
    this.ChangeReasonsLoder = true;
    this.SerivceRequest.getChangeReasons().subscribe(
      (response: any) => {
        var res = response;
        this.ChangeReasonsLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.changeReasons = res.data_params;
          } else {
            this.changeReasons = [];
          }
        }
      },
      (error: AppError) => {
        this.ChangeReasonsLoder = false;
        this.changeReasons = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }
  getServiceRequestType() {
    this.serviceRequestTypeLoder = true;
    this.SerivceRequest.getServiceRequestType().subscribe(
      (response: any) => {
        var res = response;
        this.serviceRequestTypeLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.serviceRequestTypes = res.data_params;
          } else {
            this.serviceRequestTypes = [];
          }
        }
      },
      (error: AppError) => {
        this.serviceRequestTypeLoder = false;
        this.serviceRequestTypes = [];
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }

  trackingNo: any = "";
  submitServiceRequestFrm() {
    
    this.requestServicesFrm = this.helpers.markAsTouched(this.requestServicesFrm);
    if (this.requestServicesFrm.status != "INVALID") {
      this.trackingNo = "";
      const requestServicesFrmData = this.requestServicesFrm.value;
      if (
        this.requestServicesFrm.value.serviceRequestType ==
        "Load Change Request"
      ) {
        requestServicesFrmData["loadUnit"] = "KW";
      }
      this.submitServiceRequestLoder = true;
      this.SerivceRequest.addServiceRequest(requestServicesFrmData).subscribe(
        (response: any) => {
          var res = response;
          this.submitServiceRequestLoder = false;
          this.hideServiceRequestDetailsFrm = true;
          if (res.authCode) {
            if (res.authCode == "200" && res.status == true) {
              res["msg"] =
                "Your service request has been registered successfully, We've sent a notification E-mail along with tracking number.";
              this.toastr.success(this.translationServices.translate(res.msg), "Success!");
              this.showTrackingNo = true;
              this.trackingNo = res.data_params;
              setTimeout(() => {
                this.showTrackingNo = false;
                this.trackingNo = res.data_params;
              }, 30000);
            } else {
              this.toastr.error(this.translationServices.translate(res.msg), "Failed!");
            }
          }
        },
        (error: AppError) => {
          this.submitServiceRequestLoder = false;
          this.hideServiceRequestDetailsFrm = true;
          if (error instanceof BadInput) {
          } else {
            throw error;
          }
        }
      );
    }else{
      this.toastr.warning(this.translationServices.translate("Please fill all required fields"), "Failed!");
    }
  }
}
