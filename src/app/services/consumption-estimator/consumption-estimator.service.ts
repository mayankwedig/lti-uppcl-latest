import { HelpersService } from "./../helpers/helpers.service";
import { AuthService } from "./../authService/auth.service";
import { Injectable } from "@angular/core";
import { DataService } from "../data.service";
@Injectable({
  providedIn: "root"
})
export class ConsumptionEstimatorService {
  consumptionTrendAnalysisAPI = "users/consumptionTrendAnalysis";
  constructor(
    private DataService: DataService,
    private auth: AuthService,
    private helpers: HelpersService
  ) {}
  getConsumptionTrendAnalysis(accountNumber) {
    var currentUser = this.auth.getCurrentUser();
    var body = { account_number: accountNumber, userId: currentUser.userId };
    return this.DataService.getAll(
      this.consumptionTrendAnalysisAPI,
      body,
      this.helpers.setHeaderData()
    );
  }
}
