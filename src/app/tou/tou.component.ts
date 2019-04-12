import { WindowRefService } from "./../services/window-ref/window-ref.service";
import { NetMeteringService } from "./../services/net-metering/net-metering.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { DashboardService } from "./../services/dashboard/dashboard.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DataService } from "../services/data.service";
import { Router, RouterStateSnapshot, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { INgxMyDpOptions, IMyDateModel } from "ngx-mydatepicker";
import { ErrorHandler, Inject, NgZone } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";
require("../../../node_modules/moment/min/moment.min.js");
import { TranslationService } from "../services/translation/translation.service";

/* Chart Lib Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

declare var moment: any;
declare var $: any;

@Component({
  selector: "app-tou",
  templateUrl: "./tou.component.html",
  styleUrls: ["./tou.component.css"]
})
export class TouComponent implements OnInit {
  constructor(
    private dataservice: DataService,
    private activateRoute: ActivatedRoute,
    private DashboardService: DashboardService,
    private helpers: HelpersService,
    private router: Router,
    private NetMetering: NetMeteringService,
    private toastr: ToastrService,
    private winRef: WindowRefService,
    private ngZone: NgZone,
    private translationServices: TranslationService

  ) {}

  currentYear: any = "";
  currentMonth: any = "";
  accountNumber: any = "";
  month_name: any = "";
  loder: any = false;
  isDataloader: boolean = false;
  isDataFound: boolean = false;
  chartType = "line";
  chartToShow = "hourly";
  dispString = "";
  selectedDate = "";
  selectedDay = "";
  selected_year = "";

  toudata: any = "";
  selectedDateCalc: any = "";
  tousColor = {
    TOD1: "#09b4aa",
    TOD2: "#febe00",
    TOD3: "#493ba5",
    TOD4: "#ff1db1"
  };
  myOptions: INgxMyDpOptions = {
    dateFormat: "dd/mm/yyyy",
    disableSince: {
      year: parseInt(moment().format("YYYY")),
      month: parseInt(moment().format("M")),
      day: parseInt(moment().format("DD"))
    },
    disableUntil: {
      year: 2018,
      month: 5,
      day: 31
    },
    showTodayBtn: false
  };
  touLabels: any = [];
  ngAfterViewInit() {
    setTimeout(() => {
      this.loder = true;
      this.genrateGraph();
    });
  }
  redirectTo(){
    this.router.navigate(["/peak-load-management"]);
  }
  tabularDataloader: boolean = false;
  isTabularDataFound: boolean = false;
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
  }
  setCalanderData() {
    this.selectedDateCalc = {
      date: {
        year: parseInt(this.selected_year),
        month: moment().format("M"),
        day: moment()
          .subtract(1, "days")
          .format("D")
      }
    };
    this.selectedDate =
      this.selectedDateCalc.date.year +
      "/" +
      this.selectedDateCalc.date.month +
      "/" +
      this.selectedDateCalc.date.day;
  }

  getTouData(body) {
    var SelectedDate = this.selectedDate.split("/");
    this.toudata = [];
    this.tabularDataloader = true;
    this.DashboardService.getTouData(body).subscribe(
      (response: any) => {
        var res = response;
        this.tabularDataloader = false;
        /* TEsting Data
       this.toudata=[
            {"_id":"TOD1","total":12.088},
            {"_id":"TOD2","total":12.088},
            {"_id":"TOD3","total":12.088},
            {"_id":"TOD4","total":12.088}
          ];
        this.isTabularDataFound = true;
       */
        if (res.authCode) {
          if (res.authCode == "200" && res.status == true) {
            this.toudata = res.data_params;
            this.isTabularDataFound = true;
          } else {
            this.isTabularDataFound = false;
            this.toudata = "";
          }
        }
      },
      (error: AppError) => {
        this.isTabularDataFound = false;
        this.tabularDataloader = false;
        if (error instanceof BadInput) {
        } else {
          throw error;
        }
      }
    );
  }

  onDateChanged($event) {
    if ($event.jsdate != null) {
      this.selectedDate = moment($event.jsdate).format("YYYY/MM/DD");
      this.genrateGraph();
    } else {
      this.toastr.error(this.translationServices.translate("Please Select appropriate date"), this.translationServices.translate("failed!"));
    }
  }
  dispSelectedYear = "";
  dispSelectedMonth = "";
  dispSelectedDay = "";
  getTourColour(toud) {
    var colour = "";
    var tousColor = this.tousColor;
    if (toud != null) {
      colour = tousColor[toud];
    } else {
      colour = tousColor[toud];
    }
    return colour;
  }

  genrateGraph() {
    this.tabularDataloader = false;
    this.isTabularDataFound = false;

    var tousColor = this.tousColor;
    $(".showChart").css("display", "none");

    var SelectedDate = this.selectedDate.split("/");
    this.dispSelectedYear = SelectedDate[0];
    this.dispSelectedMonth = moment(SelectedDate[1]).format("MMMM");
    this.dispSelectedDay = SelectedDate[2];
    this.loder = true;
    let data = [];
    let body = {};
    let gData = [];
    let generationData = [];
    let touLabels = [];

    this.touLabels = [];
    if (this.chartToShow == "hourly") {
      body = {
        account_number: this.accountNumber,
        month: parseInt(SelectedDate[1]),
        year: parseInt(SelectedDate[0]),
        day: parseInt(SelectedDate[2])
      };
      this.DashboardService.getHourlyGraphData(body, (result: any) => {
        this.loder = false;
        if (
          result != null &&
          result.status &&
          result.data_params.length > 0 &&
          result.data_params != null
        ) {
          /*    data = [{
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD1",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"1.117",
            "voltage":"269.81",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d65d",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":1,
            "consumption":1.117,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD1",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.068",
            "voltage":"271.06",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d65e",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":2,
            "consumption":0.068,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD1",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.073",
            "voltage":"271.94",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d65f",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":3,
            "consumption":0.073,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD1",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.069",
            "voltage":"272.05",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d660",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":4,
            "consumption":0.069,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD1",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.066",
            "voltage":"268.45",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d661",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":5,
            "consumption":0.066,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD1",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.068",
            "voltage":"266.68",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d662",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":6,
            "consumption":0.068,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD2",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.062",
            "voltage":"262.93",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d663",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":7,
            "consumption":0.062,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD2",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.065",
            "voltage":"259.73",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d664",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":8,
            "consumption":0.065,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD2",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.782",
            "voltage":"254.48",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d665",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":9,
            "consumption":0.782,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD2",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"1.055",
            "voltage":"253.42",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d666",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":10,
            "consumption":1.055,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD2",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.697",
            "voltage":"259.39",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d667",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":11,
            "consumption":0.697,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD2",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.513",
            "voltage":"260.16",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d668",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":12,
            "consumption":0.513,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD3",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"1.183",
            "voltage":"258.96",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d669",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":13,
            "consumption":1.183,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD3",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.4",
            "voltage":"263.77",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d66a",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":14,
            "consumption":0.4,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD3",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.528",
            "voltage":"264.18",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d66b",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":15,
            "consumption":0.528,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD3",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"1.429",
            "voltage":"263.25",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d66c",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":16,
            "consumption":1.429,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD3",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.505",
            "voltage":"265.28",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d66d",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":17,
            "consumption":0.505,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD3",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.709",
            "voltage":"260.41",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d66e",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":18,
            "consumption":0.709,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD4",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.394",
            "voltage":"259.11",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d66f",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":19,
            "consumption":0.394,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD4",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.292",
            "voltage":"261.96",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d670",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":20,
            "consumption":0.292,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD4",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.363",
            "voltage":"264.31",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d671",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":21,
            "consumption":0.363,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD4",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.839",
            "voltage":"265.62",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d672",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":22,
            "consumption":0.839,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD4",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.707",
            "voltage":"264.53",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d673",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":23,
            "consumption":0.707,
            "__v":0
            },
            {
            "outageFlag":"Y",
            "powerQualityIndication":"123",
            "tou":"TOD4",
            "touDescription":"UP - Time Of Day-1",
            "touConsumption":"0.104",
            "voltage":"269.07",
            "createdOn":"2019-01-21T18:30:00.000Z",
            "modifiedOn":"2019-01-22T04:43:00.165Z",
            "_id":"5c46bd085d10ab114a42d674",
            "accountNumber":"0375061951",
            "month":1,
            "year":2019,
            "day":1,
            "hour":0,
            "consumption":0.104,
            "__v":0
            }
            ]; */ /* result.data_params; */
          data = result.data_params;
          this.isDataFound = true;
          if (data.length > 0) {
            var dataSort = data.slice(0);
            dataSort.sort(function(a, b) {
              return a._id - b._id;
            });
            var i = 1;
            dataSort.map(function(item) {
              var Data = {
                hour: i,
                consumption: item.consumption
              };
              var labels = {};
              if (item.tou != null) {
                Data["lineColor"] = tousColor[item.tou];
                labels["color"] = Data["lineColor"];
                labels["label"] = item.tou;
                touLabels.push(labels);
              } else {
                Data["lineColor"] = tousColor["TOD1"];
                labels["color"] = Data["lineColor"];
                labels["label"] = "TOD1";
                touLabels.push(labels);
              }
              gData.push(Data);
              i++;
            });

            $(".showChart").css("display", "block");
            this.ngZone.runOutsideAngular(() => {
              /* Chart code */
              let chart = am4core.create("chartdiv", am4charts.XYChart);
              let data = [];
              chart.data = gData;

              let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
              categoryAxis.renderer.grid.template.location = 0;
              categoryAxis.renderer.ticks.template.disabled = true;
              categoryAxis.renderer.line.opacity = 0;
              categoryAxis.renderer.grid.template.disabled = true;
              categoryAxis.renderer.minGridDistance = 40;
              categoryAxis.dataFields.category = "hour";
              categoryAxis.startLocation = 0.4;
              categoryAxis.endLocation = 0.6;

              let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
              valueAxis.tooltip.disabled = true;
              valueAxis.renderer.line.opacity = 0;
              valueAxis.renderer.ticks.template.disabled = true;
              valueAxis.min = 0;

              let lineSeries = chart.series.push(new am4charts.LineSeries());
              lineSeries.dataFields.categoryX = "hour";
              lineSeries.dataFields.valueY = "consumption";
              lineSeries.tooltipText = "consumption: {valueY.value}";
              lineSeries.fillOpacity = 0.5;
              lineSeries.strokeWidth = 3;
              lineSeries.propertyFields.stroke = "lineColor";
              lineSeries.propertyFields.fill = "lineColor";

              let bullet = lineSeries.bullets.push(
                new am4charts.CircleBullet()
              );
              bullet.circle.radius = 6;
              bullet.circle.fill = am4core.color("#fff");
              bullet.circle.strokeWidth = 3;

              chart.cursor = new am4charts.XYCursor();
              chart.cursor.behavior = "panX";
              chart.cursor.lineX.opacity = 0;
              chart.cursor.lineY.opacity = 0;
              $("[aria-labelledby]").css("display", "none");
              chart.scrollbarX = new am4core.Scrollbar(); // uncomment if Bottom scroll bar is needed.
              chart.scrollbarX.parent = chart.bottomAxesContainer;
            });
            this.getTouData(body);
          } else {
            $(".showChart").css("display", "none");
            this.isDataFound = false;
          }
        } else {
          $(".showChart").css("display", "none");
          this.isDataFound = false;
        }
      });
    }
  }
}
