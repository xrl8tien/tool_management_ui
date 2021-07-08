import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { CustomerNotification } from 'src/app/model/CustomerNotification';
import { CommonService } from 'src/app/services/common/common.service';
import { CustomerService } from 'src/app/services/customer/customer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  listNotifications: Array<CustomerNotification>;

  constructor(public common: CommonService, private route: Router,
    private customerService: CustomerService) { }

  ngOnInit(): void {
    this.customerService.getAllNotificationByIdCustomer(jwt_decode(this.common.getCookie('token_customer'))['sub'])
      .subscribe((data => {
        this.listNotifications = data;
      }))
  }

  exit() {
    this.common.deleteCookie('token_customer');
    this.route.navigate(['login-customerweb']);
  }

}

