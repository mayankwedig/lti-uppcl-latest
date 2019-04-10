import { NetMeteringService } from "./../services/net-metering/net-metering.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "../services/data.service";
import { Router, RouterStateSnapshot, ActivatedRoute } from "@angular/router";
import { WindowRefService } from "./../services/window-ref/window-ref.service";
import { TranslationService } from "../services/translation/translation.service";

import { ToastrService } from "ngx-toastr";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
import { INgxMyDpOptions, IMyDateModel } from "ngx-mydatepicker";
require("../../../node_modules/moment/min/moment.min.js");
declare var moment: any;
declare var $: any;
@Component({
  selector: "app-net-metering",
  templateUrl: "./net-metering.component.html",
  styleUrls: ["./net-metering.component.css"]
})
export class NetMeteringComponent implements OnInit {
  constructor(
    private dataservice: DataService,
    private activateRoute: ActivatedRoute,
    private dashboard: DashboardService,
    private helpers: HelpersService,
    private router: Router,
    private NetMetering: NetMeteringService,
    private toastr: ToastrService,
    private DashboardService: DashboardService,
    private WindowRef: WindowRefService,
    private translationServices: TranslationService

  ) {}
  currentYear: any = "";
  currentMonth: any = "";

  //chart optoins
  netMeteringChartOptions: any = "";
  netMeteringlabels: any = [];
  netMeteringcolors: any = "";
  netMeteringmonthchartOptions: any = "";
  netMeteringChartData: any = "";
  netMeteringdaychartOptions: any = "";
  netMeteringdaylabels: any = "";
  netMeteringdaychartData: any = "";
  netMeteringdaycolors: any = "";

  accountNumber: any = "";
  month_name: any = "";
  loder: any = false;
  isDataFound = false;
  chartType = "line";
  chartToShow = "hourly";
  dispString = "";
  selectedDate = "";
  selectedDay: any = "";
  selected_year: any = "";
  selected_month: any = "";
  selectedDateCalc: any = "";
  myOptions: INgxMyDpOptions = {
    dateFormat: "dd/mm/yyyy",
    disableSince: {
      year: parseInt(moment().format("YYYY")),
      month: parseInt(moment().format("MM")),
      day: parseInt(moment().format("DD"))
    },
    disableUntil: {
      year: 2018,
      month: 5,
      day: 31
    },
    showTodayBtn: false
  };
  ngOnInit() {
    let accountToken = atob(this.helpers.getLocalStoragData("accountToken")); // fetch account number.
    let accountTokenInfo = accountToken.split(":");
    this.accountNumber = accountTokenInfo[1]; //account Number
    this.dispString =  this.translationServices.translate("accountnumber")+" ( " + this.accountNumber + " ) ";

    this.currentYear = moment().format("YYYY");
    this.currentMonth = moment().format("MMMM");
    this.selectedDate = moment(
      moment()
        .subtract(1, "days")
        .toString()
    ).format("YYYY-MM-DD");
    this.selectedDay = moment(
      moment()
        .subtract(1, "days")
        .toString()
    ).format("DD");
    this.selected_year = this.currentYear;
    this.setCalanderData();

    // Initialized to specific date (09.10.2018)
    /* selectedData: any = { date: { year: parseInt(this.selected_year), month: , day: 9 } }; date: {year: 2018, month: "12", day: "26"}__proto__: Object
     */
    this.initChartConfig();
    this.genrateGraph();
  }
  tabularData: any = [];
  tabularDataloader: boolean = false;
  isTabularDataFound: boolean = false;
  getTabularData(body) {
    var SelectedDate = this.selectedDate.split("/");
    this.tabularData = [];
    this.tabularDataloader = true;
    this.NetMetering.getNetMeteringTabularData(body).subscribe(
      (response: any) => {
        var res = response;
        this.tabularDataloader = false;
      /*  
      Dummy Test Data
      res["authCode"]=200;
        res["status"]=true;
        res["data_params"]= [
          {
              "_id": 15,
              "total": 44.468,
              "totalGeneration": 23.081
          }]; */
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.tabularData = res.data_params[0];
            this.isTabularDataFound = true;
          } else {
            this.isTabularDataFound = true;
            this.tabularData = "";
          }
        }
      },
      (error: AppError) => {
        this.isTabularDataFound = false;
        this.tabularDataloader = false;
        this.tabularData = "";
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }

  setCalanderData() {
    this.selectedDateCalc = {
      date: {
        year: parseInt(this.selected_year),
        month: moment().format("M"),
        day: moment()
          .subtract(1, "days")
          .format("DD")
      }
      /* disableDates: [{begin: {year: parseInt(this.selected_year), month: parseInt(moment().format("MM")), day: parseInt(moment().format("DD"))}, end: {year: 3000, month: 11, day: 20} */
    };
    this.selectedDate =
      this.selectedDateCalc.date.year +
      "/" +
      this.selectedDateCalc.date.month +
      "/" +
      this.selectedDateCalc.date.day;
  }
  onDateChanged($event) {
    console.log($event);
    if ($event.jsdate != null) {
      this.selectedDate = moment($event.jsdate).format("YYYY/MM/DD");
      this.genrateGraph();
    } else {
      this.toastr.error(this.translationServices.translate("Please Select appropriate date!"), this.translationServices.translate("failed!"));
    }
  }
  dispSelectedYear = "";
  dispSelectedMonth = "";
  dispSelectedDay = "";
  genrateGraph() {
    var SelectedDate = this.selectedDate.split("/");
    this.dispSelectedYear = SelectedDate[0];
    this.dispSelectedMonth = moment(SelectedDate[1]).format("MMMM");
    this.dispSelectedDay = SelectedDate[2];
    this.netMeteringChartData = [
      {
        label: this.translationServices.translate("Consumption"),
        data: []
      }
    ];
    this.loder = true;
    let data = [];
    this.netMeteringlabels = [];
    let body = {};
    let gData = [];
    let generationData = [];
    if (this.chartToShow == "hourly") {
      var reference_dateTime =
        this.dispSelectedYear +
        "-" +
        SelectedDate[1] +
        "-" +
        this.dispSelectedDay;
      body = {
        account_number: this.accountNumber,
        reference_dateTime: reference_dateTime,
        displayMode: "NMBH"
      };
      this.NetMetering.getNetMeteringGraphData(body, (result: any) => {
        this.loder = false;
        /****************Dummy Test data************/
       /*  result["authCode"]=200;
        result["status"]=true;
        result["data_params"]=[{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":0,"consumption":"0.1819","generation":"1.6992"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":1,"consumption":"1.4281","generation":"0.6917"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":2,"consumption":"1.6328","generation":"1.5276"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":3,"consumption":"0.7295","generation":"0.8555"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":4,"consumption":"0.2987","generation":"1.7844"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":5,"consumption":"0.3075","generation":"1.3128"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":6,"consumption":"1.4343","generation":"0.1275"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":7,"consumption":"1.7651","generation":"1.2599"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":8,"consumption":"1.4078","generation":"1.2885"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":9,"consumption":"0.5750","generation":"0.2692"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":10,"consumption":"1.3667","generation":"0.6887"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":11,"consumption":"0.6676","generation":"1.4956"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":12,"consumption":"1.7342","generation":"1.8175"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":13,"consumption":"0.6671","generation":"1.0422"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":14,"consumption":"0.5187","generation":"0.7683"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":15,"consumption":"1.8723","generation":"1.8265"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":16,"consumption":"1.8801","generation":"0.2347"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":17,"consumption":"1.5576","generation":"1.4318"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":18,"consumption":"0.8137","generation":"1.2310"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":19,"consumption":"1.5838","generation":"1.0798"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":20,"consumption":"0.9698","generation":"1.3493"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":21,"consumption":"0.6270","generation":"1.0369"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":22,"consumption":"1.9902","generation":"0.1143"},{"year":"2018","month":"12","day":"18","accountNumber":"699991234","hour":23,"consumption":"1.5087","generation":"1.5155"}] */
         /****************Dummy Test Ends data************/
        if (
          result != null &&
          result.authCode != 100 &&
          result.status != false
        ) {
          data = result.data_params;
          this.isDataFound = true;
          if (data.length > 0) {
            var dataSort = data.slice(0);
            dataSort.sort(function(a, b) {
              return a._id - b._id;
            });

            dataSort.map(function(item) {
              gData.push(item.consumption);
              generationData.push(item.generation);
            });
            this.netMeteringlabels.push(
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
              "13",
              "14",
              "15",
              "16",
              "17",
              "18",
              "19",
              "20",
              "21",
              "22",
              "23",
              "24"
            );
            this.netMeteringChartData = [
              {
                label: this.translationServices.translate("Consumption"),
                data: gData,
                fill: false,
                borderWidth: 2
              },
              {
                label: this.translationServices.translate("Generation"),
                data: generationData,
                fill: false,
                borderWidth: 2
              }
            ];
            this.getTabularData(body);
          } else {
            this.isDataFound = false;
          }
        } else {
          this.isDataFound = false;
        }
      });
    }
  }

  downloadGraphExcelNetmetering() {
    var SelectedDate = this.selectedDate.split("/");
    var excelNetmeteringHourlyData = "users/excelHourlyDataNetMetering";
    var data = {
      account_number: this.accountNumber,
      year: parseInt(SelectedDate[0]),
      month: parseInt(SelectedDate[1]),
      day: parseInt(SelectedDate[2])
    };

    this.DashboardService.downloadGraphExcel(
      excelNetmeteringHourlyData,
      data,
      (response: any) => {
        if (response.authCode == "200") {
          this.WindowRef.nativeWindow.open(response.data_params, "popup");

          //this.toastr.success("Excel downloaded successfully", "Success!");
        } else {
          //this.toastr.error("Something went wrong!", "failed!");
        }
      }
    );
  }
  /******Colour Setting Starts Here*******/
  
    genrationColour="#3cbaaa";
    consumptionColour="#3482cc";

  /******Colour Setting Ends Here*******/
  
  initChartConfig() {
    this.netMeteringChartOptions = {
      responsive: true
    };
    this.netMeteringlabels = [];
    this.netMeteringChartData = [
      {
        label: this.translationServices.translate("Consumption"),
        data: []
      }
    ];
    this.netMeteringcolors = [
      {
        backgroundColor: this.consumptionColour,
        borderColor: "#0571d7"
      },
      {
        // Genration
        backgroundColor: this.genrationColour,
        borderColor: "#3cba9f"
      }
    ];
    this.netMeteringChartData = [
      {
        label: this.translationServices.translate("Consumption"),
        data: []
      }
    ];
    this.netMeteringlabels = [];
  }
}
