import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public common:CommonService,private route:Router) { }

  ngOnInit(): void {
  }

  exit(){
    this.common.deleteCookie('token_customer');
    this.route.navigate(['login-customerweb']);
  }

}
