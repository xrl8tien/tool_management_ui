import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeInfoDTO } from 'src/app/model/EmployeeInfoDTO';
import { CommonService } from 'src/app/services/common/common.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import jwt_decode from "jwt-decode";
import { ContractrequestService } from 'src/app/services/contractRequest/contractrequest.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { Request } from 'src/app/model/Request';
import { Contract } from 'src/app/model/Contract';

@Component({
  selector: 'app-form-notice-claim',
  templateUrl: './form-notice-claim.component.html',
  styleUrls: ['./form-notice-claim.component.css']
})
export class FormNoticeClaimComponent implements OnInit {

  employeinfoDTO: EmployeeInfoDTO;
  req: Request;
  contract: Contract;

  constructor(private common: CommonService, private employeeService: EmployeeService, private activateRoute: ActivatedRoute,
    private contractRequestService: ContractrequestService, private contractService: ContractService) { }

  ngOnInit(): void {
    this.employeeService.getDetailEmployebyCode(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
      this.employeinfoDTO = data;
    }))

    this.contractRequestService.getDetailClaimRequest(this.activateRoute.snapshot.params['id']).subscribe((data => {
      this.req = data;
      let data1 = this.req.id_contract;
      this.contractService.getDetailContractForCustomer(data1).subscribe((data1 => {
        this.contract = data1;
      }))
    }))
  }

}
