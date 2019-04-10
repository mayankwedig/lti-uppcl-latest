import { HelpersService } from './../services/helpers/helpers.service';
import { Router, ActivatedRoute } from "@angular/router";
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { Component, OnInit } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { WindowRefService } from "./../services/window-ref/window-ref.service";
import { ToastrService } from "ngx-toastr";
require("../../../node_modules/moment/min/moment.min.js");
import { TranslationService } from "../services/translation/translation.service";

declare var moment: any;
declare var $: any;

@Component({
  selector: "app-billing",
  templateUrl: "./billing.component.html",
  styleUrls: ["./billing.component.css"]
})
export class BillingComponent implements OnInit {
  getselectedGraphData: any = "";
  selected_month: any = "";
  month_name: any = "";
  isMonthSelected: any = "";
  accountNumber: any = "";
  billingDataLoder: boolean = false;
  isbillingDataFound: boolean = false;
  billingData: any = "";
  currentYear: any = "";
  currentMonth: any = "";
  dispString: any = "";

  billingchartOptions: any = {};
  billinglabels: any = [];
  billingchartData: any = [];
  billingcolors: any = {};
  
  graphLoader:boolean=false;
  constructor(
    private DashboardService: DashboardService,
    private activateRoute: ActivatedRoute,
    private helpers:HelpersService,
    private WindowRef: WindowRefService,
    private toastr: ToastrService,
    private translationServices: TranslationService

  ) {}
    translate(string:string):string{
      return this.helpers.translate(string);
    }
  ngOnInit() {
    /* this.getselectedGraphData = atob(
      this.activateRoute.snapshot.queryParamMap.get("billing")
    );
    this.getselectedGraphData = this.getselectedGraphData.split(":");
    this.selected_month = this.getselectedGraphData[0];
    this.accountNumber = this.getselectedGraphData[1];
    this.month_name = this.getselectedGraphData[2];
    this.isMonthSelected = this.selected_month != "" ? true : false; */
    let accountToken=atob(this.helpers.getLocalStoragData("accountToken"));// fetch account number.
    let accountTokenInfo=accountToken.split(":");
    this.accountNumber=accountTokenInfo[1]//account Number
    this.currentYear = moment().format("YYYY");
    this.currentMonth = moment().format("MMM");
    this.dispString =  this.translate("accountnumber")+" ( " + this.accountNumber + " ) ";

    this.billinglabels = [];
    // STATIC DATA FOR THE CHART IN JSON FORMAT.
    this.billingchartData = [
      {
        label: this.translate("Billing"),
        data: []
      }
    ];
    // CHART COLOR.
    this.billingcolors = [
      // { // 1st Year.
      //   backgroundColor: 'rgba(77,83,96,0.2)'
      // },
      {
        // 2nd Year.
        backgroundColor: "rgba(81, 164, 242, 1)"
      }
    ];
    this.billingchartOptions = {
      responsive: true // THIS WILL MAKE THE CHART RESPONSIVE (VISIBLE IN ANY DEVICE).
    };

    this.getBillingData();
    this.showDailyBillingGraphData();
  }
  getBillingData() {
    this.billingDataLoder = true;
    this.DashboardService.getBillingData(this.accountNumber).subscribe(
      (response: any) => {
        var res = response;
        this.billingDataLoder = false;
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.billingData = res.data_params;
            this.isbillingDataFound = true;
          } else {
            this.isbillingDataFound = false;
            this.billingData = "";
          }
        }
      },
      (error: AppError) => {
        this.isbillingDataFound = false;
        this.billingDataLoder = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }

  downloadPDFfile(PDFURL){
    this.WindowRef.nativeWindow.open(PDFURL, "popup");

    this.toastr.success(this.translate("Excel downloaded successfully"), this.translate("Success!"));

  }


  showDailyBillingGraphData() {
    this.graphLoader=true;
    let data = [];
    let gData = [];
    let body = {
      account_number: this.accountNumber,
      year: parseInt(this.currentYear)
    };
    this.DashboardService.getDailyBillingGraph(body, (result: any) => {
      // Get Yearly Data
      this.graphLoader=false;
      if (result != null) {
        data = result.data_params;
        var dataSort = data.slice(0);
        dataSort.sort(function(a, b) {
          return a._id - b._id;
        });
        dataSort.map(function(item) {
          gData.push(item.billingAmount);
        });
        this.billinglabels.push(
          "JAN",
          "FEB",
          "MAR",
          "APR",
          "MAY",
          "JUN",
          "JUL",
          "AUG",
          "SEP",
          "OCT",
          "NOV",
          "DEC"
        );
        this.billingchartData = [
          {
            label: this.translate("Billing"),
            data: gData
          }
        ];
      }
    });
  }
}
