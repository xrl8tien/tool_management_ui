import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import jwt_decode from 'jwt-decode';
import { EmployeeInfoDTO } from 'src/app/model/EmployeeInfoDTO';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { Province } from 'src/app/model/Province';
import { GetContactInfoComponent } from '../get-contact-info/get-contact-info.component';

@Component({
  selector: 'app-home-customer',
  templateUrl: './home-customer.component.html',
  styleUrls: ['./home-customer.component.css']
})
export class HomeCustomerComponent implements OnInit {

  listProvince: Array<Province>;

  constructor(private dialog: MatDialog, public common: CommonService, private router: Router, private route: Router,
    private employeeSer: EmployeeService, private spinner: NgxSpinnerService, private customerService: CustomerService) { }
  id_role = "";
  empolyeeInfo: EmployeeInfoDTO;
  ngOnInit(): void {
    var code_em = this.common.getCookie('token_key');
    var code_cus = this.common.getCookie('token_customer');
    if (code_em) {
      this.spinner.show();
      this.employeeSer.getDetailEmployebyCode(jwt_decode(code_em)['sub']).subscribe((data => {
        this.empolyeeInfo = data;
        this.employeeSer.getAccByCode(this.common.getCookie('token_key')).subscribe((data => {
          this.id_role = data['id_role'];
          if (this.id_role == '2') {
            this.spinner.hide();
            this.router.navigate(['dashboard']);
          } else if (this.id_role == '1') {
            this.spinner.hide();
            this.router.navigate(['employee-manage']);
          } else if (this.id_role == '3') {
            this.spinner.hide();
            this.router.navigate(['appraiser-request-manage']);
          } else if (this.id_role == '4') {
            this.spinner.hide();
            this.router.navigate(['claim-request-manage']);
          } else if (this.id_role == '5') {
            this.spinner.hide();
            this.router.navigate(['dashboard']);
          } else if (this.id_role == '6') {
            this.spinner.hide();
            this.router.navigate(['dashboard-manager']);
          }
          this.spinner.hide();
        }));
      }))
    }
    if (!code_em && !code_cus) {
      if (this.common.getSession('contact') == null) {
        let dialogRef = this.dialog.open(GetContactInfoComponent, { panelClass: 'custom-dialog-container' });
        this.common.setSession('contact', 'ok');
      }
    }
  }

  onClick() {
    const dialogContact = this.dialog.open(GetContactInfoComponent, { panelClass: 'custom-dialog-container' });
  }

  exit() {
    this.common.deleteCookie('token_customer');
    this.route.navigate(['login-customer']);
  }

}