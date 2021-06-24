import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import jwt_decode from 'jwt-decode';
import { EmployeeInfoDTO } from 'src/app/model/EmployeeInfoDTO';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home-customer',
  templateUrl: './home-customer.component.html',
  styleUrls: ['./home-customer.component.css']
})
export class HomeCustomerComponent implements OnInit {

  constructor(public common:CommonService,private router: Router,private route:Router,
    private employeeSer:EmployeeService,private spinner: NgxSpinnerService) { }
  id_role = "";
  empolyeeInfo:EmployeeInfoDTO;
  ngOnInit(): void {
    var code_em = this.common.getCookie('token_key');
    if(code_em){
      this.spinner.show();
      this.employeeSer.getDetailEmployebyCode(jwt_decode(code_em)['sub']).subscribe((data => {
        this.empolyeeInfo = data;
        this.employeeSer.getAccByCode(this.common.getCookie('token_key')).subscribe((data => {
          this.id_role = data['id_role'];
          if(this.id_role == '2'){
            this.spinner.hide();
            this.router.navigate(['dashboard']);
          } else if (this.id_role == '1'){
            this.spinner.hide();
            this.router.navigate(['employee-manage']);
          } else if (this.id_role == '3'){
            this.spinner.hide();
            this.router.navigate(['appraiser-request-manage']);
          }
          this.spinner.hide();
         }));
      }))
    }
  }

  exit(){
    this.common.deleteCookie('token_customer');
    this.route.navigate(['login-customer']);
  }

}