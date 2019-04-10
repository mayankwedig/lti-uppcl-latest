import { ManageaccountService } from "./../manageaccount/manageaccount.service";
import { Injectable } from "@angular/core";
import { HelpersService } from "./../helpers/helpers.service";
import { DataService } from "./../data.service";
import { AuthService } from "../authService/auth.service";

@Injectable({
  providedIn: "root"
})
export class ComplaintsService {
  getComplaintCaseTypeAPI = "users/getComplaintCaseType";
  getComplaintBillRelatedReasonAPI = "users/getComplaintBillRelatedReason";
  addComplaintAPI = "users/addComplaint";
  getComplaintSupplyProblemAPI = "users/getComplaintSupplyProblem";
  getComplaintSupplyServiceRequestAPI =
    "users/getComplaintSupplyServiceRequest";
  getComplaintListAPI = "users/complaintList";
  complaintRequestDetailsAPI = "users/complaintDetails";
  constructor(
    private userAccounts: ManageaccountService,
    private data: DataService,
    private auth: AuthService,
    private helper: HelpersService
  ) {}
  getAccounts() {
    return this.userAccounts.getAccount("");
  }
  getComplaintCaseType() {
    return this.data.getAll(this.getComplaintCaseTypeAPI, "", {}, "POST");
  }
  getComplaintBillRelatedReason() {
    return this.data.getAll(
      this.getComplaintBillRelatedReasonAPI,
      "",
      {},
      "POST"
    );
  }
  getComplaintSupplyProblem() {
    return this.data.getAll(this.getComplaintSupplyProblemAPI, "", {}, "POST");
  }
  getComplaintSupplyServiceRequest() {
    return this.data.getAll(
      this.getComplaintSupplyServiceRequestAPI,
      "",
      {},
      "POST"
    );
  }
  getComplaintData(accountNumber) {
    var currentUser = this.auth.getCurrentUser();
    var body = {
      accountToken: btoa(accountNumber),
      profileToken: btoa(currentUser.userId)
    };
    return this.data.getAll(
      this.getComplaintListAPI,
      body,
      this.helper.setHeaderData()
    );
  }

  addComplaint(updSubsData) {
    var currentUser = this.auth.getCurrentUser();
    updSubsData["profileToken"] = btoa(currentUser.userId);
    return this.data.getAll(
      this.addComplaintAPI,
      updSubsData,
      this.helper.setHeaderData(),
      "POST"
    );
  }
  addComplaintBeforeLogin(updSubsData) {
    var currentUser = this.auth.getCurrentUser();
    updSubsData["profileToken"] = "";
    return this.data.getAll(this.addComplaintAPI, updSubsData, {}, "POST");
  }
  getComplaintRequestDetails(updSubsData) {
    if (this.auth.isLoggedIn()) {
      var currentUser = this.auth.getCurrentUser();
      updSubsData["profileToken"] = btoa(currentUser.userId);
      return this.data.getAll(
        this.complaintRequestDetailsAPI,
        updSubsData,
        this.helper.setHeaderData(),
        "POST"
      );
    } else {
      return this.data.getAll(
        "users/complaintDetailsByTrackingNumber",
        updSubsData,
        {},
        "POST"
      );
    }
  }
  getDetails(userData) {
    return this.data.getAll("users/soaAccountDetails", userData, {}, "POST");
  }
}
