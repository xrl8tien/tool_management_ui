import { Component, OnInit } from '@angular/core';
import jwt_decode from "jwt-decode";
import { CommonService } from 'src/app/services/common/common.service';
import { Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { CustomerInfo } from 'src/app/model/CustomerInfo';
import { Contract } from 'src/app/model/Contract';
import { ContractService } from 'src/app/services/contract/contract.service';

@Component({
  selector: 'app-contact-birthday-info',
  templateUrl: './contact-birthday-info.component.html',
  styleUrls: ['./contact-birthday-info.component.css']
})
export class ContactBirthdayInfoComponent implements OnInit {

  customerinfos: Array<CustomerInfo> = [];
  listBirthdayCus: Array<CustomerInfo> = [];
  listContract: Array<Contract> = [];
  ContractNotApproved: number = 0;
  ContractApproved: number = 0;
  listExpiredContract: Array<Contract> = [];

  constructor(private router: Router,
    private common: CommonService, private customerService: CustomerService, private contractService: ContractService,) { }

  ngOnInit(): void {
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
        let day = new Date(this.listContract[i].end_time)
        if (this.calculateDiff(day) <= 30 && this.calculateDiff(day) >= 0 && this.listContract[i].approval_status == "DD") {
          this.listExpiredContract.push(this.listContract[i]);
        }
      }
    }))


  }

  calculateDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) - Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) / (1000 * 60 * 60 * 24));
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




}
