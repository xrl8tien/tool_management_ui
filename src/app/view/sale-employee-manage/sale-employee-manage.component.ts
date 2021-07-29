import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { NgxSpinnerService } from 'ngx-spinner';
import { EmployeeInfoDTO } from 'src/app/model/EmployeeInfoDTO';
import { GroupDTO } from 'src/app/model/GroupDTO';
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
  listEmployee: Array<EmployeeInfoDTO>;
  id_role = "";
  pageGroup: number = 1;
  totalRecordsGroup: number;
  listGroup: Array<GroupDTO>;

  ngOnInit(): void {
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
    this.employeeService.getAccByCode(this.common.getCookie('token_key')).subscribe((data => {
      this.id_role = data['id_role'];
      if (this.id_role == '5') {
        this.common.titlePage = "Danh Sách Nhân Viên Kinh Doanh";
        this.employeeService.getAllInfoAccEx(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
          this.listEmployee = data;
          this.totalRecords = data.length;
          this.spinner.hide();
        }))
      } else if (this.id_role == '6') {
        this.common.titlePage = "Danh Sách Nhóm";
        this.employeeService.getAllGroup(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
          this.listGroup = data;
          this.totalRecordsGroup = data.length;
          this.spinner.hide();
        }))
      }
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
        this.listEmployee = data;
        this.totalRecords = data.length;
        this.spinner.hide();
        this.page = 1;
      }))

    } catch (error) {
      console.log(error);
    }
  }

  ResetDate() {
    this.dateFrom = null;
    this.dateTo = null;
  }

  searchValueGroup: String = "";
  SearchGroup() {
    this.spinner.show();
    try {
      let searchText = "%" + this.searchValueGroup + "%";
      this.employeeService.searchAllGroup(searchText).subscribe((data => {
        this.listGroup = data;
        this.totalRecordsGroup = data.length;
        this.spinner.hide();
        this.pageGroup = 1;
      }))

    } catch (error) {
      console.log(error);
    }
  }

  dashboardDialog(code_sale: string) {
    let dialogRef = this.dialog.open(SaleDashboardComponent, {
      // maxWidth: '250vw',
      // maxHeight: '250vh',
      data: code_sale
    });
    dialogRef.afterClosed().subscribe(result => {
    })
  }

  key = '';
  reverse: boolean = true;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

}
