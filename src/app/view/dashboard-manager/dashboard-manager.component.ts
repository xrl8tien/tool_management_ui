import { Component, OnInit, ViewChild } from '@angular/core';
import { RevenueService } from 'src/app/services/revenue/revenue.service';
import jwt_decode from "jwt-decode";
import { CommonService } from 'src/app/services/common/common.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { Router } from '@angular/router';
import { Income } from 'src/app/model/Income';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexLegend,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexGrid
} from "ng-apexcharts";
import { CustomerService } from 'src/app/services/customer/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { RequestClaimApprove } from 'src/app/model/RequestClaimApprove';
import { ContractrequestService } from 'src/app/services/contractRequest/contractrequest.service';

export type ChartOptions1 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any; //ApexMarkers;
  stroke: any; //ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
  colors: string[];
};
export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  colors: string[];
  labels: any;
};
export type ChartOptions3 = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any; //ApexMarkers;
  stroke: any; //ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  // grid: ApexGrid;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
  colors: string[];
};

@Component({
  selector: 'app-dashboard-manager',
  templateUrl: './dashboard-manager.component.html',
  styleUrls: ['./dashboard-manager.component.css']
})
export class DashboardManagerComponent implements OnInit {

  @ViewChild("chart1") chart1: ChartComponent;
  public chartOptions1: Partial<ChartOptions1>;
  @ViewChild("chart2") chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions2>;
  @ViewChild("chart3") chart3: ChartComponent;
  public chartOptions3: Partial<ChartOptions3>;

  constructor(private router: Router, private revenueService: RevenueService,
    private common: CommonService, private contractService: ContractService,
    private customerService: CustomerService, private dialog: MatDialog,
    private spinner: NgxSpinnerService, private employeeService: EmployeeService,
    private contractRequestService: ContractrequestService) { }

  dateNow: Date = new Date();
  month: number = this.dateNow.getMonth() + 1;
  year: number = this.dateNow.getFullYear();
  listPredic = Array<ItemPredic>();
  listIncome: Array<Income> = [];
  codes_sale: Array<string> = [];
  listPayment: Array<RequestClaimApprove>;
  RevenueThisMonth: number = 0;
  progressColor = 'green'
  remainingProgressColor = 'red';


  ngOnInit(): void {
    this.common.titlePage = "Tổng Quan";
    this.CalculateRevenueThisYear();
  }

  CalculateRevenueThisYear() {
    this.spinner.show();
    this.customerService.getAllCodeSale(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((codes => {
      this.codes_sale = codes;
      for (let i = 0; i < 12; i++) {
        let itemPredic = new ItemPredic(i + 1, 0, 0);
        this.listPredic.push(itemPredic);
      }
      this.revenueService.getAllIncomeSalerEx(this.codes_sale).subscribe((data => {
        this.listIncome = data;
        this.listIncome.forEach(item => {
          var startTime = new Date(item.start_time);
          if (startTime.getFullYear() == this.year) {
            this.listPredic[startTime.getMonth()].revenue += item.revenue_val;
          }
          var startTime = new Date(item.start_time);// tháng mà khach hàng bắt đầu ký hợp đồng và trao tiền
          var nextTime = this.addMonths(new Date(item.start_time), this.transformPeriod(item.description));
          while (true) {
            if (nextTime.getFullYear() > this.year) break;
            else if (nextTime.getFullYear() == this.year) {
              this.listPredic.forEach(element => {
                if (element.month == (nextTime.getMonth() + 1)) {
                  if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) == 1) {
                    element.revenue += ((item.revenue_val * 95 / 15) - (item.income / 1.5));
                  } else if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) == 2) {
                    element.revenue += ((item.revenue_val * 95 / 15) - (item.income / 3));
                  } else if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) == 3) {
                    element.revenue += ((item.revenue_val * 95 / 15) - (item.income / 6));
                  } else if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) > 3) {
                    element.revenue += (item.revenue_val * 95 / 15);
                  }
                }
              })
            }
            nextTime = this.addMonths(new Date(nextTime), this.transformPeriod(item.description));
            this.RevenueThisMonth = this.listPredic[this.month - 1].revenue;
          }
        })

        this.contractRequestService.getAllApprovalManagerReq(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
          this.listPayment = data;
          this.listPayment.forEach(item => {
            var startTime = new Date(item.date);
            if (startTime.getFullYear() == this.year) {
              this.listPredic[startTime.getMonth()].payment += (item.amount_main + item.amount_sub);
            }
          })
          this.chartOptions1 = {
            series: [
              {
                name: "Revenue",
                type: "area",
                data: [Math.round(this.listPredic[0].revenue), Math.round(this.listPredic[1].revenue),
                Math.round(this.listPredic[2].revenue), Math.round(this.listPredic[3].revenue),
                Math.round(this.listPredic[4].revenue), Math.round(this.listPredic[5].revenue),
                Math.round(this.listPredic[6].revenue), Math.round(this.listPredic[7].revenue),
                Math.round(this.listPredic[8].revenue), Math.round(this.listPredic[9].revenue),
                Math.round(this.listPredic[10].revenue), Math.round(this.listPredic[11].revenue)]
              }
            ],
            chart: {
              height: 257,
              type: "area",
              stacked: false,
              fontFamily: 'Times New Roman, sans-serif',
            },
            dataLabels: {
              enabled: false,
            },
            title: {
              align: "left",
              offsetX: 110
            },
            xaxis: {
              categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
            },
            yaxis: [
              {
                seriesName: "Revenue",
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#008FFB"
                },
                labels: {
                  style: {
                    // color: "#008FFB"
                  }
                },
                title: {
                  text: "Revenue (Đồng)",
                  style: {
                    color: "#008FFB"
                  }
                },
                tooltip: {
                  enabled: false
                }
              }
            ],
            tooltip: {
              fixed: {
                enabled: true,
                position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
                offsetY: 30,
                offsetX: 60
              }
            },
            legend: {
              horizontalAlign: "left",
              offsetX: 40
            }
          };
          this.chartOptions3 = {
            series: [
              {
                name: "Payment",
                type: "area",
                data: [Math.round(this.listPredic[0].payment), Math.round(this.listPredic[1].payment),
                Math.round(this.listPredic[2].payment), Math.round(this.listPredic[3].payment),
                Math.round(this.listPredic[4].payment), Math.round(this.listPredic[5].payment),
                Math.round(this.listPredic[6].payment), Math.round(this.listPredic[7].payment),
                Math.round(this.listPredic[8].payment), Math.round(this.listPredic[9].payment),
                Math.round(this.listPredic[10].payment), Math.round(this.listPredic[11].payment)]
              }
            ],
            colors: ['#F44336', '#E91E63', '#9C27B0'],
            chart: {
              height: 257,
              type: "area",
              stacked: false,
              fontFamily: 'Times New Roman, sans-serif',
            },
            dataLabels: {
              enabled: false,
            },
            title: {
              align: "left",
              offsetX: 110
            },
            xaxis: {
              categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
            },
            yaxis: [
              {
                seriesName: "Payment",
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#F44336"
                },
                labels: {
                  style: {
                    // color: "#FEB019"
                  }
                },
                title: {
                  text: "Payment (Đồng)",
                  style: {
                    color: "#E91E63"
                  }
                }
              }
            ],
            tooltip: {
              fixed: {
                enabled: true,
                position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
                offsetY: 30,
                offsetX: 60
              }
            },
            // markers: {
            //   size: 1
            // },
            legend: {
              horizontalAlign: "right",
              offsetX: 40,
              floating: false,
            }
          };
          this.chartOptions2 = {
            series: [],
            chart: {
              height: 347,
              type: "donut",
            },
            labels: [],
            colors: ["#008ffb", "#775dd0", "#ff4560", "#ffd900", "#00e396", "#D2691E"]
          };
          this.contractService.getAllProductDTO(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
            for (let i = 0; i < data.length; i++) {
              this.chartOptions2.series.push(data[i].number_products);
              this.chartOptions2.labels.push(data[i].benifit_name);
            }
          }))
        }))
      }))
      this.spinner.hide();
    }))
  }

  addMonths(date: Date, months: number) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  transformPeriod(data: any) {
    switch (data) {
      case ("Năm"): {
        return 12;
      } case ("Nửa Năm"): {
        return 6;
      } case ("Quý"): {
        return 3;
      } case ("Tháng"): {
        return 1;
      }
    }
  }

  calculateDate(dateNext, dateStart, payment_period) {
    dateNext = new Date(dateNext);
    dateStart = new Date(dateStart);
    if (payment_period == 12) {
      return (Math.floor((Date.UTC(dateNext.getFullYear(), dateNext.getMonth(), dateNext.getDate()) - Date.UTC(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate())) / (1000 * 60 * 60 * 24))) / 365;
    } else if (payment_period == 6) {
      return (Math.floor((Date.UTC(dateNext.getFullYear(), dateNext.getMonth(), dateNext.getDate()) - Date.UTC(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate())) / (1000 * 60 * 60 * 24))) / 182;
    } else if (payment_period == 3) {
      return (Math.floor((Date.UTC(dateNext.getFullYear(), dateNext.getMonth(), dateNext.getDate()) - Date.UTC(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate())) / (1000 * 60 * 60 * 24))) / 91;
    } else {
      return (Math.floor((Date.UTC(dateNext.getFullYear(), dateNext.getMonth(), dateNext.getDate()) - Date.UTC(dateStart.getFullYear(), dateStart.getMonth(), dateStart.getDate())) / (1000 * 60 * 60 * 24))) / 30;
    }
  }

}

class ItemPredic {
  month: number;
  revenue: number;
  payment: number;

  constructor(
    month: number,
    revenue: number,
    payment: number
  ) {
    this.month = month;
    this.revenue = revenue;
    this.payment = payment;
  }
}
