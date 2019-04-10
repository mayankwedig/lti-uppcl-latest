import { ConsumptionEstimatorService } from "./../services/consumption-estimator/consumption-estimator.service";
import { WindowRefService } from "./../services/window-ref/window-ref.service";
import { NetMeteringService } from "./../services/net-metering/net-metering.service";
import { HelpersService } from "./../services/helpers/helpers.service";
import { Component, OnInit, ViewChild } from "@angular/core";

import { ToastrService } from "ngx-toastr";
import { INgxMyDpOptions, IMyDateModel } from "ngx-mydatepicker";
import { ErrorHandler, Inject, NgZone } from "@angular/core";
import { BadInput } from "./../common/bad-input";
import { AppError } from "./../common/app-error";

require("../../../node_modules/moment/min/moment.min.js");

/* Chart Lib Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { TranslationService } from "../services/translation/translation.service";


// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

declare var moment: any;
declare var $: any;

@Component({
  selector: "app-consumption-estimator",
  templateUrl: "./consumption-estimator.component.html",
  styleUrls: ["./consumption-estimator.component.css"]
})
export class ConsumptionEstimatorComponent implements OnInit {
  constructor(
    private helpers: HelpersService,
    private NetMetering: NetMeteringService,
    private toastr: ToastrService,
    private winRef: WindowRefService,
    private ngZone: NgZone,
    private consumptionEstService: ConsumptionEstimatorService,
    private translationServices: TranslationService

  ) {}

  currentYear: any = "";
  currentMonth: any = "";
  accountNumber: any = "";

  loder: any = false;

  isDataFound: boolean = false;

  dispString = "";
  selectedDate = "";
  selectedDay = "";
  selected_year = "";

  selectedDateCalc: any = "";

  dispSelectedYear = "";
  dispSelectedMonth = "";
  dispSelectedDay = "";
   
  estimatedMonthConsumption:any="";
  daily_avg_consumption:any="";
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
  ngAfterViewInit() {
    setTimeout(() => {
      this.loder = true;
      this.getEstimator();
    });
  }
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
  getEstimator() {
    $(".showChart").css("display", "none");
    console.log(this.selectedDate);
    var SelectedDate = this.selectedDate.split("/");
    this.dispSelectedYear = SelectedDate[0];
    this.dispSelectedMonth = moment(SelectedDate[1]).format("MMMM");
    this.dispSelectedDay = SelectedDate[2];
    this.loder = true;
    this.consumptionEstService
      .getConsumptionTrendAnalysis(this.accountNumber)
      .subscribe(
        (result: any) => {
          
          this.loder = false;
          if (
            result != null &&
            result.status == true &&
            result.data_params.length > 0 &&
            result.data_params != null &&
            result.authCode == 200
          ) {
            /* console.log("dfdf"); */
            var data = result.data_params;
            this.daily_avg_consumption=result.daily_avg_consumption
            this.estimatedMonthConsumption=result.estimatedMonthConsumption
            this.isDataFound = true;
            this.genrateGraph(data);
          } else {
            $(".showChart").css("display", "none");
            this.isDataFound = false;
          }
        },
        (error: AppError) => {
          this.isDataFound = false;
          this.loder = false;
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
          /* .subtract(1, "days") */
          .format("DD")
      }
    };
    this.selectedDate =
      this.selectedDateCalc.date.year +
      "/" +
      this.selectedDateCalc.date.month +
      "/" +
      this.selectedDateCalc.date.day;
  }
  genrateGraph(data) {
    var data = data;
    var gData = [];
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
        var currDay = parseInt(moment().format("DD"));
       /*  console.log(currDay,item.day,item.day >= currDay); */
        if (item.day >= currDay) {
          Data["dashLength"] = 4;
          Data["alpha"] = 0.4; //Data["lineColor"];
        }
        gData.push(Data);
        i++;
      });
      $(".showChart").css("display", "block");
      this.ngZone.runOutsideAngular(() => {
        let chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.data = gData;
        chart.colors.step = 2;
        chart.maskBullets = false;

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

        lineSeries.strokeWidth = 3;
        lineSeries.propertyFields.strokeDasharray = "dashLength";

        let bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
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
    } else {
      $(".showChart").css("display", "none");
      this.isDataFound = false;
    }
  }
  onDateChanged($event) {
    if ($event.jsdate != null) {
      this.selectedDate = moment($event.jsdate).format("YYYY/MM/DD");
      this.getEstimator();
    } else {
      this.toastr.error(this.translationServices.translate("Please Select appropriate date!"), this.translationServices.translate("failed!"));
    }
  }
}
/* result["data_params"] = [
  {
    _id: "5c481dde8b956e15ae22ddc1",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 4.004,
    day: 1,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddc2",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 6.142,
    day: 2,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddc3",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 6.348,
    day: 3,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddc4",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 7.701,
    day: 4,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddc5",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 9.627,
    day: 5,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddc6",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 11.552,
    day: 6,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddc7",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 13.477,
    day: 7,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddc8",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 15.403,
    day: 8,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddc9",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 17.328,
    day: 9,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddca",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 19.253,
    day: 10,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddcb",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 21.179,
    day: 11,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddcc",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 23.104,
    day: 12,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddcd",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 25.029,
    day: 13,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddce",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 26.955,
    day: 14,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddcf",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 28.88,
    day: 15,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddd0",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 6.375,
    day: 16,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddd1",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 11.504,
    day: 17,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddd2",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 11.552,
    day: 18,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddd3",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 36.581,
    day: 19,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddd4",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 38.507,
    day: 20,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddd5",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 40.432,
    day: 21,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddd6",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 42.357,
    day: 22,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddd7",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 44.283,
    day: 23,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddd8",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 46.208,
    day: 24,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddd9",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 48.133,
    day: 25,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddda",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 50.059,
    day: 26,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22dddb",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 51.984,
    day: 27,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22dddc",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 53.909,
    day: 28,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22dddd",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 55.835,
    day: 29,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22ddde",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 57.76,
    day: 30,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  },
  {
    _id: "5c481dde8b956e15ae22dddf",
    createdOn: "2019-01-22T18:30:00.000Z",
    modifiedOn: "2019-01-23T07:54:50.688Z",
    accountNumber: "1801285399",
    month: 1,
    year: 2019,
    consumption: 59.685,
    day: 31,
    estimatedMonthConsumption: "59.685",
    daily_avg_consumption: "1.925",
    __v: 0
  }
];

result["status"] = true; */
