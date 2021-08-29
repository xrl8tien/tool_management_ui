import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Request } from 'src/app/model/Request';
import jwt_decode from 'jwt-decode';
import { ContractrequestService } from 'src/app/services/contractRequest/contractrequest.service';
import { CommonService } from 'src/app/services/common/common.service';
import jwtDecode from 'jwt-decode';
import { NgxSpinnerService } from 'ngx-spinner';
import { ContractService } from 'src/app/services/contract/contract.service';
import { Contract } from 'src/app/model/Contract';
import { MatDialog } from '@angular/material/dialog';
import { ContractDetailDialogComponent } from '../dialog/contract-detail-dialog/contract-detail-dialog.component';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { IllustrationService } from 'src/app/services/illustration/illustration.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { RequestClaimApprove } from 'src/app/model/RequestClaimApprove';
import { ClaimManagerFormComponent } from '../dialog/claim-manager-form/claim-manager-form.component';
import { EmployeeInfoDTO } from 'src/app/model/EmployeeInfoDTO';

@Component({
  selector: 'app-claim-request-manage',
  templateUrl: './claim-request-manage.component.html',
  styleUrls: ['./claim-request-manage.component.css']
})
export class ClaimRequestManageComponent implements OnInit {

  constructor(private dialog: MatDialog,
    private contractService: ContractService,
    private spinner: NgxSpinnerService,
    private common: CommonService,
    private contractRequestService: ContractrequestService,
    private router: Router,
    private employeeService: EmployeeService,
    private illustrationService: IllustrationService,
    private customerService: CustomerService) { }

  pageApprovals: number = 1;
  pageApproved: number = 1;
  pageRequest: number = 1;
  pageManagerCheck: number = 1;
  pageManagerUncheck: number = 1;
  totalRecordsApprovals: number;
  totalRecordsRequest: number;
  totalRecordsApproveds: number;
  totalManagerCheck: number;
  totalManagerUncheck: number;
  contractRequests: Array<Request>
  contractRequestsApprovals: Array<Request>
  contractRequestsApproveds: Array<RequestClaimApprove>
  requestManagerCheck: Array<RequestClaimApprove>
  requestManagerUncheck: Array<RequestClaimApprove>
  id_role = "";
  employeinfoDTO: EmployeeInfoDTO;

  ngOnInit(): void {
    this.common.titlePage = "Danh Sách Yêu Cầu Bồi Thường Bảo Hiểm";
    this.employeeService.getAccByCode(this.common.getCookie('token_key')).subscribe((data => {
      this.id_role = data['id_role'];
      if (this.id_role == '4') {
        this.contractRequestService.getAllClaimRequest(jwtDecode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
          this.contractRequests = data;
          this.totalRecordsRequest = this.contractRequests.length;
        }))
        this.contractRequestService.getAllClaimRequestApproval(jwtDecode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
          this.contractRequestsApprovals = data;
          this.contractRequestsApprovals.forEach(element => {
            element.status = this.common.transformStatus(element.status);
          });
          this.totalRecordsApprovals = this.contractRequestsApprovals.length;
        }))
        this.contractRequestService.getAllApprovalManagerReq(jwtDecode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
          this.contractRequestsApproveds = data;
          this.contractRequestsApproveds.forEach(element => {
            element.status = this.common.transformStatus(element.status);
          });
          this.totalRecordsApproveds = this.contractRequestsApproveds.length;
        }))
      } else if (this.id_role == '6') {
        this.contractRequestService.getAllUncheckManagerReq(jwtDecode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
          this.requestManagerUncheck = data;
          this.totalManagerUncheck = this.requestManagerUncheck.length;
        }))
        this.contractRequestService.getAllCheckManagerReq(jwtDecode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
          this.requestManagerCheck = data;
          this.requestManagerCheck.forEach(element => {
            element.status = this.common.transformStatus(element.status);
          });
          this.totalManagerCheck = this.requestManagerCheck.length;
        }))
      }
    }))
  }

  public requestDetail(id_request: number) {
    this.router.navigate(['claim-request-detail', id_request]);
  }

  public claimNoticeForm(id_request: number) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/form-notice-claim/${id_request}`])
    );
    window.open(url, '_blank');
  }

  contract: Contract;
  public openDialogContractDetail(id_contract: number) {
    this.contractService.getDetailContract(id_contract).subscribe((dataReturn => {
      this.contract = dataReturn;
      let dialogRef = this.dialog.open(ContractDetailDialogComponent, {
        height: '80%',
        width: '50%',
        data: this.contract
      });
    }))
  }

  searchValueRequest: String = "";
  dateFromRequest: Date;
  dateToRequest: Date;
  SearchRequest() {
    this.spinner.show();
    try {
      let dateTo1: String;
      let dateFrom1: String;
      let dateToValue = (<HTMLInputElement>document.getElementById('RtoSearchRequest')).value;
      let dateFromValue = (<HTMLInputElement>document.getElementById('RfromSearchRequest')).value;
      if (dateFromValue == "") {
        this.dateFromRequest = new Date('1990-01-01');
        dateFrom1 = this.dateFromRequest.getFullYear() + "-" + (this.dateFromRequest.getMonth() + 1) + "-" + this.dateFromRequest.getDate()
      } else {
        dateFrom1 = this.dateFromRequest.toString();
      }

      if (dateToValue == "") {
        this.dateToRequest = new Date('3000-01-01');
        dateTo1 = this.dateToRequest.getFullYear() + "-" + (this.dateToRequest.getMonth() + 1) + "-" + (this.dateToRequest.getDate() + 1)
      }
      else {
        dateTo1 = this.dateToRequest.toString();
      }
      let searchText = "%" + this.searchValueRequest + "%";
      this.contractRequestService.searchAllClaimRequest(jwtDecode(this.common.getCookie('token_key'))['sub'], dateFrom1, dateTo1, searchText).subscribe((data => {
        this.contractRequests = data;
        this.totalRecordsRequest = this.contractRequests.length;
        this.spinner.hide();
        this.pageRequest = 1;
      }))
    } catch (error) {
      console.log(error);
    }
  }

  ResetDateRequest() {
    this.dateFromRequest = null;
    this.dateToRequest = null;
  }


  searchValueApproval: String = "";
  dateFromApproval: Date;
  dateToApproval: Date;
  SearchApproval() {
    this.spinner.show();
    try {
      let dateTo1: String;
      let dateFrom1: String;
      let dateToValue = (<HTMLInputElement>document.getElementById('RtoSearchApproval')).value;
      let dateFromValue = (<HTMLInputElement>document.getElementById('RfromSearchApproval')).value;
      if (dateFromValue == "") {
        this.dateFromApproval = new Date('1990-01-01');
        dateFrom1 = this.dateFromApproval.getFullYear() + "-" + (this.dateFromApproval.getMonth() + 1) + "-" + this.dateFromApproval.getDate()
      } else {
        dateFrom1 = this.dateFromApproval.toString();
      }

      if (dateToValue == "") {
        this.dateToApproval = new Date('3000-01-01');
        dateTo1 = this.dateToApproval.getFullYear() + "-" + (this.dateToApproval.getMonth() + 1) + "-" + (this.dateToApproval.getDate() + 1)
      }
      else {
        dateTo1 = this.dateToApproval.toString();
      }
      let searchText = "%" + this.searchValueApproval + "%";
      this.contractRequestService.searchAllClaimRequestApproval(jwtDecode(this.common.getCookie('token_key'))['sub'], dateFrom1, dateTo1, searchText).subscribe((data => {
        this.contractRequestsApprovals = data;
        this.totalRecordsApprovals = this.contractRequestsApprovals.length;
        this.spinner.hide();
        this.pageApprovals = 1;
      }))
    } catch (error) {
      console.log(error);
    }
  }

  ResetDateApproval() {
    this.dateFromApproval = null;
    this.dateToApproval = null;
  }

  searchValueApproved: String = "";
  dateFromApproved: Date;
  dateToApproved: Date;
  SearchApproved() {
    this.spinner.show();
    try {
      let dateTo1: String;
      let dateFrom1: String;
      let dateToValue = (<HTMLInputElement>document.getElementById('RtoSearchApproved')).value;
      let dateFromValue = (<HTMLInputElement>document.getElementById('RfromSearchApproved')).value;
      if (dateFromValue == "") {
        this.dateFromApproved = new Date('1990-01-01');
        dateFrom1 = this.dateFromApproved.getFullYear() + "-" + (this.dateFromApproved.getMonth() + 1) + "-" + this.dateFromApproved.getDate()
      } else {
        dateFrom1 = this.dateFromApproved.toString();
      }

      if (dateToValue == "") {
        this.dateToApproved = new Date('3000-01-01');
        dateTo1 = this.dateToApproved.getFullYear() + "-" + (this.dateToApproved.getMonth() + 1) + "-" + this.dateToApproved.getDate()
      }
      else {
        dateTo1 = this.dateToApproved.toString();
      }
      let searchText = "%" + this.searchValueApproved + "%";
      this.contractRequestService.searchAllApprovalManagerReq(jwtDecode(this.common.getCookie('token_key'))['sub'], dateFrom1, dateTo1, searchText).subscribe((data => {
        this.contractRequestsApproveds = data;
        this.totalRecordsApproveds = this.contractRequestsApproveds.length;
        this.spinner.hide();
        this.pageApproved = 1;
      }))
    } catch (error) {
      console.log(error);
    }
  }

  ResetDateApproved() {
    this.dateFromApproved = null;
    this.dateToApproved = null;
  }

  searchValueUncheck: String = "";
  dateFromUncheck: Date;
  dateToUncheck: Date;
  SearchUncheck() {
    this.spinner.show();
    try {
      let dateTo1: String;
      let dateFrom1: String;
      let dateToValue = (<HTMLInputElement>document.getElementById('RtoSearchUncheck')).value;
      let dateFromValue = (<HTMLInputElement>document.getElementById('RfromSearchUncheck')).value;
      if (dateFromValue == "") {
        this.dateFromUncheck = new Date('1990-01-01');
        dateFrom1 = this.dateFromUncheck.getFullYear() + "-" + (this.dateFromUncheck.getMonth() + 1) + "-" + this.dateFromUncheck.getDate()
      } else {
        dateFrom1 = this.dateFromUncheck.toString();
      }

      if (dateToValue == "") {
        this.dateToUncheck = new Date('3000-01-01');
        dateTo1 = this.dateToUncheck.getFullYear() + "-" + (this.dateToUncheck.getMonth() + 1) + "-" + (this.dateToUncheck.getDate() + 1)
      }
      else {
        dateTo1 = this.dateToUncheck.toString();
      }
      let searchText = "%" + this.searchValueUncheck + "%";

      this.contractRequestService.searchAllUncheckManagerReq(jwtDecode(this.common.getCookie('token_key'))['sub'], dateFrom1, dateTo1, searchText).subscribe((data => {
        this.requestManagerUncheck = data;
        this.totalManagerUncheck = this.requestManagerUncheck.length;
        this.spinner.hide();
        this.pageManagerUncheck = 1;
      }))
    } catch (error) {
      console.log(error);
    }
  }

  ResetDateUncheck() {
    this.dateFromUncheck = null;
    this.dateToUncheck = null;
  }

  searchValueCheck: String = "";
  dateFromCheck: Date;
  dateToCheck: Date;
  SearchCheck() {
    this.spinner.show();
    try {
      let dateTo1: String;
      let dateFrom1: String;
      let dateToValue = (<HTMLInputElement>document.getElementById('RtoSearchCheck')).value;
      let dateFromValue = (<HTMLInputElement>document.getElementById('RfromSearchCheck')).value;
      if (dateFromValue == "") {
        this.dateFromCheck = new Date('1990-01-01');
        dateFrom1 = this.dateFromCheck.getFullYear() + "-" + (this.dateFromCheck.getMonth() + 1) + "-" + this.dateFromCheck.getDate()
      } else {
        dateFrom1 = this.dateFromCheck.toString();
      }

      if (dateToValue == "") {
        this.dateToCheck = new Date('3000-01-01');
        dateTo1 = this.dateToCheck.getFullYear() + "-" + (this.dateToCheck.getMonth() + 1) + "-" + (this.dateToCheck.getDate() + 1)
      }
      else {
        dateTo1 = this.dateToCheck.toString();
      }
      let searchText = "%" + this.searchValueCheck + "%";

      this.contractRequestService.searchAllCheckManagerReq(jwtDecode(this.common.getCookie('token_key'))['sub'], dateFrom1, dateTo1, searchText).subscribe((data => {
        this.requestManagerCheck = data;
        this.totalManagerCheck = this.requestManagerCheck.length;
        this.spinner.hide();
        this.pageManagerCheck = 1;
      }))
    } catch (error) {
      console.log(error);
    }
  }

  displayConfirmDialog(claimRequest: RequestClaimApprove): void {
    let dialogRef = this.dialog.open(ClaimManagerFormComponent, { data: claimRequest });
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    })
  }

  ResetDateCheck() {
    this.dateFromCheck = null;
    this.dateToCheck = null;
  }

  key = '';
  reverse: boolean = true;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

}
