import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeInfoDTO } from 'src/app/model/EmployeeInfoDTO';
import { CommonService } from 'src/app/services/common/common.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { ServerHttpService } from 'src/app/services/http/server-http.service';
import { SaleDashboardComponent } from '../dialog/sale-dashboard/sale-dashboard.component';

@Component({
  selector: 'app-sale-employee-manage',
  templateUrl: './sale-employee-manage.component.html',
  styleUrls: ['./sale-employee-manage.component.css']
})
export class SaleEmployeeManageComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private serverHttpService: ServerHttpService,
    private employeeService: EmployeeService, public dialog: MatDialog, private router: Router,
    private common: CommonService) { }

  page: number = 1;
  totalRecords: number;
  data: Array<EmployeeInfoDTO>;

  ngOnInit(): void {
    this.common.titlePage = "Danh Sách Nhân Viên Kinh Doanh";
    this.employeeService.subsVar = this.employeeService.
      callRefreshTable.subscribe((name: string) => {
        this.refresh();
      });
    this.refresh();
  }

  public EmployeeDetail(id: number) {
    this.router.navigate(['employee-detail-admin', id]);
  }

  public refresh() {
    this.spinner.show();
    this.employeeService.getAllInfoAccEx(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
      this.data = data;
      this.totalRecords = data.length;
      this.spinner.hide();
    }))
  }

  searchValue: String = "";
  dateFrom: Date;
  dateTo: Date;
  Search() {
    this.spinner.show();
    try {
      let dateTo1: String;
      let dateFrom1: String;
      let dateToValue = (<HTMLInputElement>document.getElementById('RtoSearch')).value;
      let dateFromValue = (<HTMLInputElement>document.getElementById('RfromSearch')).value;
      if (dateFromValue == "") {
        this.dateFrom = new Date('1990-01-01');
        dateFrom1 = this.dateFrom.getFullYear() + "-" + (this.dateFrom.getMonth() + 1) + "-" + this.dateFrom.getDate()
      } else {
        dateFrom1 = this.dateFrom.toString();
      }

      if (dateToValue == "") {
        this.dateTo = new Date();
        dateTo1 = this.dateTo.getFullYear() + "-" + (this.dateTo.getMonth() + 1) + "-" + (this.dateTo.getDate() + 1)
      }
      else {
        dateTo1 = this.dateTo.toString();
      }
      let searchText = "%" + this.searchValue + "%";
      this.employeeService.searchAllInfoAccEx(jwt_decode(this.common.getCookie('token_key'))['sub'], dateFrom1, dateTo1, searchText).subscribe((data => {
        this.data = data;
        this.totalRecords = data.length;
        this.spinner.hide();
        this.page = 1;
      }))

    } catch (error) {
      console.log(error);
    }
  }

  dashboardDialog(code_sale: string) {
    let dialogRef = this.dialog.open(SaleDashboardComponent, {
      width: '100%',
      data: code_sale
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }


  ResetDate() {
    this.dateFrom = null;
    this.dateTo = null;
  }


  key = '';
  reverse: boolean = true;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

}