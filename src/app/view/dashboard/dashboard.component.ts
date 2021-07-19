import { Component, OnInit, ViewChild } from '@angular/core';
import { RevenueService } from 'src/app/services/revenue/revenue.service';
import jwt_decode from "jwt-decode";
import { CommonService } from 'src/app/services/common/common.service';
import { Revenue } from 'src/app/model/Revenue';
import { ContractService } from 'src/app/services/contract/contract.service';
import { Contract } from 'src/app/model/Contract';
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
  ApexYAxis
} from "ng-apexcharts";
import { Kpi } from 'src/app/model/Kpi';
import { CustomerInfo } from 'src/app/model/CustomerInfo';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { MatDialog } from '@angular/material/dialog';
import { DayNotificationDialogComponent } from '../dialog/day-notification-dialog/day-notification-dialog.component';
import { Contact } from 'src/app/model/Contact';
import { NgxSpinnerService } from 'ngx-spinner';

export type ChartOptions = {
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
};
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
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @ViewChild("chart1") chart1: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;
  // chartOptions = {
  //   responsive: true
  // };
  // chartData = [];

  // public chartColors: Array<any> = [
  //   {
  //     // first color
  //     backgroundColor: 'rgb(255,59,59)',
  //     borderColor: 'rgb(255,255,255)'
  //   }
  // ];
  // chartLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

  constructor(private router: Router, private revenueService: RevenueService,
    private common: CommonService, private contractService: ContractService,
    private customerService: CustomerService, private dialog: MatDialog, private spinner: NgxSpinnerService) {

  }
  // danh sách này để hiển thị
  listIncomePredic = Array<itemIncomePredic>();
  // danh sách thu nhập trong năm nay bao gồm các thu nhập dự đoán trước, danh sách này lấy từ API
  listIncome: Array<Income> = [];
  listKpi: Array<Kpi> = [];

  dateNow: Date = new Date();
  month: number = this.dateNow.getMonth() + 1;
  year: number = this.dateNow.getFullYear();
  listRevenueEmployeeYearBefore: Array<Revenue> = [];
  listContract: Array<Contract> = [];
  monthRevenueList: Array<number> = [];
  ContractApproved: number = 0;
  ContractNotApproved: number = 0;
  IncomeLastMonth: number = 0;
  IncomeThisMonth: number = 0;
  listRevenueEmployeeMonthBefore: Array<Revenue> = [];
  listRevenueEmployeeMonthNow: Array<Revenue> = [];
  percentBetweenIncome: String;
  incomeStatus: String;
  listBirthdayCus: Array<CustomerInfo> = [];
  listExpiredContract: Array<Contract> = [];
  customerinfos: Array<CustomerInfo> = [];

  listId: Array<number>;
  listContact: Array<Contact>;
  listContactOld: Array<Contact>;
  district_name: string = "";

  ngOnInit(): void {
    this.common.titlePage = "Tổng Quan";
    this.CalculateIncomeForThisYear();
    this.FindBirthdayCus();
    this.refresh();

    this.contractService.getAllContract(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
      this.listContract = data;
      for (let i = 0; i < this.listContract.length; i++) {
        if (this.listContract[i].approval_status == "DXD") {
          this.ContractNotApproved += 1;
        }
        if (this.listContract[i].approval_status == "DD") {
          this.ContractApproved += 1;
        }
        let day = new Date(this.listContract[i].start_time)
        if (this.calculateDiff(day, this.listContract[i].payment_period_id) <= 30 && this.calculateDiff(day, this.listContract[i].payment_period_id) >= 0 && this.listContract[i].approval_status == "DD") {
          this.listExpiredContract.push(this.listContract[i]);
        }
      }
    }))



  }
  refresh() {
    this.spinner.show();
    this.customerService.getAllDistrictByCodeSale(jwt_decode(this.common.getCookie('token_key'))['sub'])
      .subscribe((ids => {
        this.listId = ids;
        this.customerService.getDistrictNameById(this.listId).subscribe((data => {
          for (let i = 0; i < data.length; i++) {
            if (i < data.length - 1)
              this.district_name += " " + data[i] + ", "
            else
              this.district_name += " " + data[i]
          }
        }))
        this.customerService.getAllNewContactByDistrictIds(this.listId).subscribe((data => {
          this.listContact = data;
        }))
        this.customerService.getAllOldContactByDistrictIds(this.listId).subscribe((data => {
          this.listContactOld = data;
        }))
        this.spinner.hide();
      }))
  }
  ContractPage() {
    this.router.navigate["contract"];
  }
  RevenuePage() {
    this.router.navigate["income"];
  }

  FindBirthdayCus() {
    let today = new Date();
    this.customerService.getAllCustomerInfo(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
      this.customerinfos = data;
      for (let i = 0; i < this.customerinfos.length; i++) {
        let day = new Date(this.customerinfos[i].birth_date)
        if (day.getDate() == today.getDate() && day.getMonth() == today.getMonth()) {
          this.listBirthdayCus.push(this.customerinfos[i]);
        }
      }
    }))
  }

  calculateDiff(dateSent, payment_period) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    if (payment_period == 1) {
      dateSent.setDate(dateSent.getDate() + 365);
    } else if (payment_period == 2) {
      dateSent.setDate(dateSent.getDate() + 182);
    } else if (payment_period == 3) {
      dateSent.setDate(dateSent.getDate() + 91);
    } else {
      dateSent.setDate(dateSent.getDate() + 30);
    }

    return Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
  }

  CalculateIncomeForThisYear() {
    for (let i = 0; i < 12; i++) {
      let incomePredic = new itemIncomePredic(i + 1, 0, 0, 0);
      this.listIncomePredic.push(incomePredic);
    }
    this.revenueService.getAllIncomeSaler(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
      this.listIncome = data;
      this.listIncome.forEach(item => {
        //Bước 1: cộng income vào tháng mà hợp đồng này bắt đầu hoạt động
        var startTime = new Date(item.start_time);
        if (startTime.getFullYear() == this.year) {
          this.listIncomePredic[startTime.getMonth()].income += item.income;
          this.listIncomePredic[startTime.getMonth()].revenue += item.revenue_val;
        }
        //Bước 2: Tính Income cho các tháng tiếp theo trong năm đó
        var startTime = new Date(item.start_time);// tháng mà khach hàng bắt đầu ký hợp đồng và trao tiền
        var desTime = this.addMonths(new Date(item.start_time), 12); // thời gian 1 năm đầu tiên của hợp đồng tính từ ngày đầu tiên
        var nextTime = this.addMonths(new Date(item.start_time), this.transformPeriod(item.description));
        while (true) {
          if (nextTime.getFullYear() > this.year) break;
          else if (nextTime.getFullYear() == this.year) {
            this.listIncomePredic.forEach(element => {
              if (element.month == (nextTime.getMonth() + 1)) {
                if (nextTime > startTime && nextTime <= desTime) { // nếu là các năm tiếp theo thì income giảm 5 lần còn trong năm đầu tiên thì giữ nguyên income

                  element.income += item.income;
                } else {
                  element.income += item.income / 5;
                }
                element.revenue += item.revenue_val;
              }
            })
          }
          nextTime = this.addMonths(new Date(nextTime), this.transformPeriod(item.description));
        }
      })
      this.IncomeLastMonth = this.listIncomePredic[this.month - 2].income;
      this.IncomeThisMonth = this.listIncomePredic[this.month - 1].income;
      if (this.IncomeThisMonth > this.IncomeLastMonth) {
        this.incomeStatus = 'Tăng';
      }
      else if (this.IncomeThisMonth < this.IncomeLastMonth) {
        this.incomeStatus = 'Giảm';
      } else {
        this.incomeStatus = 'Không Xác Định';
      }
      if (this.incomeStatus == "Tăng") {
        this.percentBetweenIncome = Math.round((((this.IncomeThisMonth - this.IncomeLastMonth) / this.IncomeThisMonth) * 100)).toString() + "%";
      }
      else if (this.incomeStatus == "Giảm") {
        this.percentBetweenIncome = Math.round((((this.IncomeLastMonth - this.IncomeThisMonth) / this.IncomeLastMonth) * 100)).toString() + "%";
      } else {
        this.percentBetweenIncome = '';
      }
      this.revenueService.getAllKpi(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
        this.listKpi = data;
        this.listKpi.forEach(item => {
          var startTime = new Date(item.create_time);
          if (startTime.getFullYear() == this.year) {
            this.listIncomePredic[startTime.getMonth()].kpi = item.target;
          }
        })
        this.chartOptions = {
          series: [
            {
              name: "Income",
              type: "column",
              data: [this.listIncomePredic[0].income, this.listIncomePredic[1].income,
              this.listIncomePredic[2].income, this.listIncomePredic[3].income,
              this.listIncomePredic[4].income, this.listIncomePredic[5].income,
              this.listIncomePredic[6].income, this.listIncomePredic[7].income,
              this.listIncomePredic[8].income, this.listIncomePredic[9].income,
              this.listIncomePredic[10].income, this.listIncomePredic[11].income]
            }
          ],
          chart: {
            height: 350,
            type: "bar",
            stacked: false,
            fontFamily: 'Times New Roman, sans-serif'
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: [1, 1, 4]
          },
          title: {
            text: "Biều đồ thu nhập sale năm 2021",
            align: "left",
            offsetX: 110
          },
          xaxis: {
            categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
          },
          yaxis: [
            {
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
                text: "Income (Đồng)",
                style: {
                  color: "#008FFB"
                }
              },
              tooltip: {
                enabled: true
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
        this.chartOptions1 = {
          series: [
            {
              name: "Revenue",
              type: "column",
              data: [this.listIncomePredic[0].revenue, this.listIncomePredic[1].revenue,
              this.listIncomePredic[2].revenue, this.listIncomePredic[3].revenue,
              this.listIncomePredic[4].revenue, this.listIncomePredic[5].revenue,
              this.listIncomePredic[6].revenue, this.listIncomePredic[7].revenue,
              this.listIncomePredic[8].revenue, this.listIncomePredic[9].revenue,
              this.listIncomePredic[10].revenue, this.listIncomePredic[11].revenue]
            },
            {
              name: "KPI",
              type: "line",
              data: [this.listIncomePredic[0].kpi, this.listIncomePredic[1].kpi,
              this.listIncomePredic[2].kpi, this.listIncomePredic[3].kpi,
              this.listIncomePredic[4].kpi, this.listIncomePredic[5].kpi,
              this.listIncomePredic[6].kpi, this.listIncomePredic[7].kpi,
              this.listIncomePredic[8].kpi, this.listIncomePredic[9].kpi,
              this.listIncomePredic[10].kpi, this.listIncomePredic[11].kpi]
            }
          ],
          chart: {
            height: 350,
            type: "line",
            stacked: false,
            fontFamily: 'Times New Roman, sans-serif'
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            width: [1, 7, 4]
          },
          title: {
            text: "Biều đồ doanh thu, KPI sale năm 2021",
            align: "left",
            offsetX: 110
          },
          xaxis: {
            categories: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']
          },
          yaxis: [
            {
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
                enabled: true
              }
            },
            {
              seriesName: "KPI",
              opposite: true,
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
                color: "#FEB019"
              },
              labels: {
                style: {
                  // color: "#FEB019"
                }
              },
              title: {
                text: "KPI (Đồng)",
                style: {
                  color: "#FEB019"
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
          legend: {
            horizontalAlign: "left",
            offsetX: 40
          }
        };
      }))
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

  openDayNotificationDialog(): void {
    let dialogRef = this.dialog.open(DayNotificationDialogComponent, {
      data: { listBirthdayCus: this.listBirthdayCus, listExpiredContract: this.listExpiredContract },
      height: '600px',
      width: '2000px',
    });
    dialogRef.afterClosed().subscribe(result => {

    })
  }

}



class itemIncomePredic {
  month: number;
  income: number;
  revenue: number;
  kpi: number;

  constructor(
    month: number,
    income: number,
    revenue: number,
    kpi: number
  ) {
    this.month = month;
    this.income = income;
    this.revenue = revenue;
    this.kpi = kpi;
  }


}