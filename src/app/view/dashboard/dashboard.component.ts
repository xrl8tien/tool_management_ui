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
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { EmployeeInfoDTO } from 'src/app/model/EmployeeInfoDTO';

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
  public chartOptions1: Partial<ChartOptions1>;

  constructor(private router: Router, private revenueService: RevenueService,
    private common: CommonService, private contractService: ContractService,
    private customerService: CustomerService, private dialog: MatDialog,
    private spinner: NgxSpinnerService, private employeeService: EmployeeService) {
  }
  // danh s??ch n??y ????? hi???n th???
  listIncomePredic = Array<itemIncomePredic>();
  // danh s??ch thu nh???p trong n??m nay bao g???m c??c thu nh???p d??? ??o??n tr?????c, danh s??ch n??y l???y t??? API
  listIncome: Array<Income> = [];
  listKpi: Array<Kpi> = [];

  dateNow: Date = new Date();
  month: number = this.dateNow.getMonth() + 1;
  year: number = this.dateNow.getFullYear();
  listContract: Array<Contract> = [];
  ContractApproved: number = 0;
  ContractNotApproved: number = 0;
  IncomeLastMonth: number = 0;
  IncomeThisMonth: number = 0;
  percentBetweenIncome: String;
  incomeStatus: String;
  listBirthdayCus: Array<CustomerInfo> = [];
  listExpiredContract: Array<Contract> = [];
  customerinfos: Array<CustomerInfo> = [];

  listId: Array<number>;
  listContact: Array<Contact>;

  id_role = "";
  codes_sale: Array<string> = [];

  employeeList: Array<EmployeeInfoDTO>;

  ngOnInit(): void {
    this.common.titlePage = "T???ng Quan";
    this.CalculateIncomeForThisYear();
    this.refresh();
    this.getEmployeeList();

    this.employeeService.getAccByCode(this.common.getCookie('token_key')).subscribe((data => {
      this.id_role = data['id_role'];
      if (this.id_role == '2') {
        this.FindBirthdayCus();
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
      } else if (this.id_role == '5') {
        this.customerService.getAllCodeSaleByCodeEx(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((codes => {
          this.codes_sale = codes;
          this.codes_sale.push(jwt_decode(this.common.getCookie('token_key'))['sub']);
          this.contractService.getAllContractEx(this.codes_sale).subscribe((data => {
            this.listContract = data;
            for (let i = 0; i < this.listContract.length; i++) {
              if (this.listContract[i].approval_status == "DXD") {
                this.ContractNotApproved += 1;
              }
              if (this.listContract[i].approval_status == "DD") {
                this.ContractApproved += 1;
              }
            }
          }))
        }))
      }
    }))
  }

  getEmployeeList() {
    this.employeeService.getAllInfoAccEx(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
      this.employeeList = data;
    }))
  }

  refresh() {
    this.spinner.show();
    this.employeeService.getAccByCode(this.common.getCookie('token_key')).subscribe((data => {
      this.id_role = data['id_role'];
      if (this.id_role == '2') {
        this.customerService.getAllDistrictByCodeSale(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((ids => {
          this.listId = ids;
          this.customerService.getAllNewContactByDistrictIds(this.listId).subscribe((data => {
            this.listContact = data;
          }))
          this.spinner.hide();
        }))
      } else if (this.id_role == '5') {
        this.customerService.getProvinceByCodeEx(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((province => {
          this.customerService.getAllNewContactByProvince(province.id).subscribe((data => {
            this.listContact = data;
          }))
          this.spinner.hide();
        }))
      }
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

  CalculateIncomeForThisYear() {
    this.employeeService.getAccByCode(this.common.getCookie('token_key')).subscribe((data => {
      this.id_role = data['id_role'];
      if (this.id_role == '2') {
        for (let i = 0; i < 12; i++) {
          let incomePredic = new itemIncomePredic(i + 1, 0, 0, 0);
          this.listIncomePredic.push(incomePredic);
        }
        this.revenueService.getAllIncomeSaler(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
          this.listIncome = data;
          this.listIncome.forEach(item => {
            //B?????c 1: c???ng income v??o th??ng m?? h???p ?????ng n??y b???t ?????u ho???t ?????ng
            var startTime = new Date(item.start_time);
            if (startTime.getFullYear() == this.year) {
              this.listIncomePredic[startTime.getMonth()].income += (item.income * 0.9);
              this.listIncomePredic[startTime.getMonth()].revenue += item.revenue_val;
            }
            //B?????c 2: T??nh Income cho c??c th??ng ti???p theo trong n??m ????
            var startTime = new Date(item.start_time);// th??ng m?? khach h??ng b???t ?????u k?? h???p ?????ng v?? trao ti???n
            var nextTime = this.addMonths(new Date(item.start_time), this.transformPeriod(item.description));
            while (true) {
              if (nextTime.getFullYear() > this.year) break;
              else if (nextTime.getFullYear() == this.year) {
                this.listIncomePredic.forEach(element => {
                  if (element.month == (nextTime.getMonth() + 1)) {
                    if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) == 1) {
                      element.income += ((item.income / 1.5) * 0.9);
                      element.revenue += ((item.revenue_val * 95 / 15) - (item.income / 1.5));
                    } else if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) == 2) {
                      element.income += ((item.income / 3) * 0.9);
                      element.revenue += ((item.revenue_val * 95 / 15) - (item.income / 3));
                    } else if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) == 3) {
                      element.income += ((item.income / 6) * 0.9);
                      element.revenue += ((item.revenue_val * 95 / 15) - (item.income / 6));
                    } else if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) > 3) {
                      element.revenue += (item.revenue_val * 95 / 15);
                    }
                  }
                })
              }
              nextTime = this.addMonths(new Date(nextTime), this.transformPeriod(item.description));
            }
          })
          this.IncomeLastMonth = this.listIncomePredic[this.month - 2].income;
          this.IncomeThisMonth = this.listIncomePredic[this.month - 1].income;
          if (this.IncomeThisMonth > this.IncomeLastMonth) {
            this.incomeStatus = 'T??ng';
          }
          else if (this.IncomeThisMonth < this.IncomeLastMonth) {
            this.incomeStatus = 'Gi???m';
          } else {
            this.incomeStatus = 'Kh??ng X??c ?????nh';
          }
          if (this.incomeStatus == "T??ng") {
            this.percentBetweenIncome = Math.round((((this.IncomeThisMonth - this.IncomeLastMonth) / this.IncomeThisMonth) * 100)).toString() + "%";
          }
          else if (this.incomeStatus == "Gi???m") {
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
                  data: [Math.round(this.listIncomePredic[0].income), Math.round(this.listIncomePredic[1].income),
                  Math.round(this.listIncomePredic[2].income), Math.round(this.listIncomePredic[3].income),
                  Math.round(this.listIncomePredic[4].income), Math.round(this.listIncomePredic[5].income),
                  Math.round(this.listIncomePredic[6].income), Math.round(this.listIncomePredic[7].income),
                  Math.round(this.listIncomePredic[8].income), Math.round(this.listIncomePredic[9].income),
                  Math.round(this.listIncomePredic[10].income), Math.round(this.listIncomePredic[11].income)]
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
                text: "",
                align: "left",
                offsetX: 110
              },
              xaxis: {
                categories: ['Th??ng 1', 'Th??ng 2', 'Th??ng 3', 'Th??ng 4', 'Th??ng 5', 'Th??ng 6', 'Th??ng 7', 'Th??ng 8', 'Th??ng 9', 'Th??ng 10', 'Th??ng 11', 'Th??ng 12']
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
                    text: "Income (?????ng)",
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
                  data: [Math.round(this.listIncomePredic[0].revenue), Math.round(this.listIncomePredic[1].revenue),
                  Math.round(this.listIncomePredic[2].revenue), Math.round(this.listIncomePredic[3].revenue),
                  Math.round(this.listIncomePredic[4].revenue), Math.round(this.listIncomePredic[5].revenue),
                  Math.round(this.listIncomePredic[6].revenue), Math.round(this.listIncomePredic[7].revenue),
                  Math.round(this.listIncomePredic[8].revenue), Math.round(this.listIncomePredic[9].revenue),
                  Math.round(this.listIncomePredic[10].revenue), Math.round(this.listIncomePredic[11].revenue)]
                },
                {
                  name: "KPI",
                  type: "line",
                  data: [Math.round(this.listIncomePredic[0].kpi), Math.round(this.listIncomePredic[1].kpi),
                  Math.round(this.listIncomePredic[2].kpi), Math.round(this.listIncomePredic[3].kpi),
                  Math.round(this.listIncomePredic[4].kpi), Math.round(this.listIncomePredic[5].kpi),
                  Math.round(this.listIncomePredic[6].kpi), Math.round(this.listIncomePredic[7].kpi),
                  Math.round(this.listIncomePredic[8].kpi), Math.round(this.listIncomePredic[9].kpi),
                  Math.round(this.listIncomePredic[10].kpi), Math.round(this.listIncomePredic[11].kpi)]
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
                text: "",
                align: "left",
                offsetX: 110
              },
              xaxis: {
                categories: ['Th??ng 1', 'Th??ng 2', 'Th??ng 3', 'Th??ng 4', 'Th??ng 5', 'Th??ng 6', 'Th??ng 7', 'Th??ng 8', 'Th??ng 9', 'Th??ng 10', 'Th??ng 11', 'Th??ng 12']
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
                    text: "(VN??)",
                    style: {
                      color: "#008FFB"
                    }
                  },
                  tooltip: {
                    enabled: true
                  }
                },
                {
                  seriesName: "Revenue",
                    show: false
                  // opposite: true,
                  // axisTicks: {
                  //   show: true
                  // },
                  // axisBorder: {
                  //   show: true,
                  //   color: "#FEB019"
                  // },
                  // labels: {
                  //   style: {
                  //     // color: "#FEB019"
                  //   }
                  // },
                  // title: {
                  //   text: "KPI (VN??)",
                  //   style: {
                  //     color: "#FEB019"
                  //   }
                  // }
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
      } else if (this.id_role == '5') {
        this.customerService.getAllCodeSaleByCodeEx(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((codes => {
          this.codes_sale = codes;
          this.codes_sale.push(jwt_decode(this.common.getCookie('token_key'))['sub']);
          for (let i = 0; i < 12; i++) {
            let incomePredic = new itemIncomePredic(i + 1, 0, 0, 0);
            this.listIncomePredic.push(incomePredic);
          }
          this.revenueService.getAllIncomeSalerEx(this.codes_sale).subscribe((data => {
            this.listIncome = data;
            this.listIncome.forEach(item => {
              if (item.code_em_support == jwt_decode(this.common.getCookie('token_key'))['sub']) {
                //B?????c 1: c???ng income v??o th??ng m?? h???p ?????ng n??y b???t ?????u ho???t ?????ng
                var startTime = new Date(item.start_time);
                if (startTime.getFullYear() == this.year) {
                  this.listIncomePredic[startTime.getMonth()].income += item.income;
                  this.listIncomePredic[startTime.getMonth()].revenue += item.revenue_val;
                }
                //B?????c 2: T??nh Income cho c??c th??ng ti???p theo trong n??m ????
                var startTime = new Date(item.start_time);// th??ng m?? khach h??ng b???t ?????u k?? h???p ?????ng v?? trao ti???n
                var nextTime = this.addMonths(new Date(item.start_time), this.transformPeriod(item.description));
                while (true) {
                  if (nextTime.getFullYear() > this.year) break;
                  else if (nextTime.getFullYear() == this.year) {
                    this.listIncomePredic.forEach(element => {
                      if (element.month == (nextTime.getMonth() + 1)) {
                        if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) == 1) {
                          element.income += (item.income / 1.5);
                          element.revenue += ((item.revenue_val * 95 / 15) - (item.income / 1.5));
                        } else if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) == 2) {
                          element.income += (item.income / 3);
                          element.revenue += ((item.revenue_val * 95 / 15) - (item.income / 3));
                        } else if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) == 3) {
                          element.income += (item.income / 6);
                          element.revenue += ((item.revenue_val * 95 / 15) - (item.income / 6));
                        } else if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) > 3) {
                          element.revenue += (item.revenue_val * 95 / 15);
                        }
                      }
                    })
                  }
                  nextTime = this.addMonths(new Date(nextTime), this.transformPeriod(item.description));
                }
              } else {
                //B?????c 1: c???ng income v??o th??ng m?? h???p ?????ng n??y b???t ?????u ho???t ?????ng
                var startTime = new Date(item.start_time);
                if (startTime.getFullYear() == this.year) {
                  this.listIncomePredic[startTime.getMonth()].income += (item.income * 0.1);
                  this.listIncomePredic[startTime.getMonth()].revenue += item.revenue_val;
                }
                //B?????c 2: T??nh Income cho c??c th??ng ti???p theo trong n??m ????
                var startTime = new Date(item.start_time);// th??ng m?? khach h??ng b???t ?????u k?? h???p ?????ng v?? trao ti???n
                var nextTime = this.addMonths(new Date(item.start_time), this.transformPeriod(item.description));
                while (true) {
                  if (nextTime.getFullYear() > this.year) break;
                  else if (nextTime.getFullYear() == this.year) {
                    this.listIncomePredic.forEach(element => {
                      if (element.month == (nextTime.getMonth() + 1)) {
                        if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) == 1) {
                          element.income += ((item.income / 1.5) * 0.1);
                          element.revenue += ((item.revenue_val * 95 / 15) - (item.income / 1.5));
                        } else if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) == 2) {
                          element.income += ((item.income / 3) * 0.1);
                          element.revenue += ((item.revenue_val * 95 / 15) - (item.income / 3));
                        } else if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) == 3) {
                          element.income += ((item.income / 6) * 0.1);
                          element.revenue += ((item.revenue_val * 95 / 15) - (item.income / 6));
                        } else if (nextTime > startTime && this.calculateDate(nextTime, startTime, this.transformPeriod(item.description)) > 3) {
                          element.revenue += (item.revenue_val * 95 / 15);
                        }
                      }
                    })
                  }
                  nextTime = this.addMonths(new Date(nextTime), this.transformPeriod(item.description));
                }
              }
            })
            this.IncomeLastMonth = this.listIncomePredic[this.month - 2].income;
            this.IncomeThisMonth = this.listIncomePredic[this.month - 1].income;
            if (this.IncomeThisMonth > this.IncomeLastMonth) {
              this.incomeStatus = 'T??ng';
            }
            else if (this.IncomeThisMonth < this.IncomeLastMonth) {
              this.incomeStatus = 'Gi???m';
            } else {
              this.incomeStatus = 'Kh??ng X??c ?????nh';
            }
            if (this.incomeStatus == "T??ng") {
              this.percentBetweenIncome = Math.round((((this.IncomeThisMonth - this.IncomeLastMonth) / this.IncomeThisMonth) * 100)).toString() + "%";
            }
            else if (this.incomeStatus == "Gi???m") {
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
                    data: [Math.round(this.listIncomePredic[0].income), Math.round(this.listIncomePredic[1].income),
                    Math.round(this.listIncomePredic[2].income), Math.round(this.listIncomePredic[3].income),
                    Math.round(this.listIncomePredic[4].income), Math.round(this.listIncomePredic[5].income),
                    Math.round(this.listIncomePredic[6].income), Math.round(this.listIncomePredic[7].income),
                    Math.round(this.listIncomePredic[8].income), Math.round(this.listIncomePredic[9].income),
                    Math.round(this.listIncomePredic[10].income), Math.round(this.listIncomePredic[11].income)]
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
                  text: "Bi???u ????? thu nh???p n??m 2021",
                  align: "left",
                  offsetX: 110
                },
                xaxis: {
                  categories: ['Th??ng 1', 'Th??ng 2', 'Th??ng 3', 'Th??ng 4', 'Th??ng 5', 'Th??ng 6', 'Th??ng 7', 'Th??ng 8', 'Th??ng 9', 'Th??ng 10', 'Th??ng 11', 'Th??ng 12']
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
                      text: "Income (?????ng)",
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
                    data: [Math.round(this.listIncomePredic[0].revenue), Math.round(this.listIncomePredic[1].revenue),
                    Math.round(this.listIncomePredic[2].revenue), Math.round(this.listIncomePredic[3].revenue),
                    Math.round(this.listIncomePredic[4].revenue), Math.round(this.listIncomePredic[5].revenue),
                    Math.round(this.listIncomePredic[6].revenue), Math.round(this.listIncomePredic[7].revenue),
                    Math.round(this.listIncomePredic[8].revenue), Math.round(this.listIncomePredic[9].revenue),
                    Math.round(this.listIncomePredic[10].revenue), Math.round(this.listIncomePredic[11].revenue)]
                  },
                  {
                    name: "KPI",
                    type: "line",
                    data: [Math.round(this.listIncomePredic[0].kpi), Math.round(this.listIncomePredic[1].kpi),
                    Math.round(this.listIncomePredic[2].kpi), Math.round(this.listIncomePredic[3].kpi),
                    Math.round(this.listIncomePredic[4].kpi), Math.round(this.listIncomePredic[5].kpi),
                    Math.round(this.listIncomePredic[6].kpi), Math.round(this.listIncomePredic[7].kpi),
                    Math.round(this.listIncomePredic[8].kpi), Math.round(this.listIncomePredic[9].kpi),
                    Math.round(this.listIncomePredic[10].kpi), Math.round(this.listIncomePredic[11].kpi)]
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
                  text: "Bi???u ????? doanh thu - KPI n??m 2021",
                  align: "left",
                  offsetX: 110
                },
                xaxis: {
                  categories: ['Th??ng 1', 'Th??ng 2', 'Th??ng 3', 'Th??ng 4', 'Th??ng 5', 'Th??ng 6', 'Th??ng 7', 'Th??ng 8', 'Th??ng 9', 'Th??ng 10', 'Th??ng 11', 'Th??ng 12']
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
                      text: "(VN??)",
                      style: {
                        color: "#008FFB"
                      }
                    },
                    tooltip: {
                      enabled: true
                    }
                  },
                  {
                    seriesName: "Revenue",
                    show: false
                    // opposite: true,
                    // axisTicks: {
                    //   show: true
                    // },
                    // axisBorder: {
                    //   show: true,
                    //   color: "#FEB019"
                    // },
                    // labels: {
                    //   style: {
                    //     // color: "#FEB019"
                    //   }
                    // },
                    // title: {
                    //   text: "KPI (?????ng)",
                    //   style: {
                    //     color: "#FEB019"
                    //   }
                    // }
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
        }))
      }
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
      case ("N??m"): {
        return 12;
      } case ("N???a N??m"): {
        return 6;
      } case ("Qu??"): {
        return 3;
      } case ("Th??ng"): {
        return 1;
      }
    }
  }

  openDayNotificationDialog(): void {
    let dialogRef = this.dialog.open(DayNotificationDialogComponent, {
      data: { listBirthdayCus: this.listBirthdayCus, listExpiredContract: this.listExpiredContract },
      height: '550px',
      width: '100%',
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