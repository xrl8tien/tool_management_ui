import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Contract } from 'src/app/model/Contract';
import { CustomerNotification } from 'src/app/model/CustomerNotification';
import { RequestClaimApprove } from 'src/app/model/RequestClaimApprove';
import { ContractService } from 'src/app/services/contract/contract.service';
import { ContractrequestService } from 'src/app/services/contractRequest/contractrequest.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-claim-manager-form',
  templateUrl: './claim-manager-form.component.html',
  styleUrls: ['./claim-manager-form.component.css']
})
export class ClaimManagerFormComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public claimRequest: RequestClaimApprove,
    private snackBar: SnackbarService, private spinner: NgxSpinnerService,
    private contractRequestService: ContractrequestService,
    private contractService: ContractService, private router: Router) { }

  approveStatus: string;
  description: string;
  contract: Contract;

  ngOnInit(): void {
    this.contractService.getDetailContractForCustomer(this.claimRequest.id_contract).subscribe((data => {
      this.contract = data;
    }))
  }

  Review() {
    this.spinner.show();
    if (this.approveStatus == "DD") {
      this.contractRequestService.setStatusRequest(this.claimRequest.id_request, this.description, this.approveStatus).subscribe((data => {
        this.contractRequestService.setStatusClaimRequest(this.claimRequest.id, this.description, this.approveStatus).subscribe((data => {
          let noti = new CustomerNotification(0, this.contract.id_customer, this.claimRequest.name, "Yêu cầu của bạn đã được phê duyệt thanh toán!", "list-request-customer", 1, new Date());
          this.contractRequestService.addOneNotification(noti).subscribe((noti => {
            this.spinner.hide();
            this.snackBar.openSnackBar("Xử Lý Yêu Cầu Thành Công", "Đóng");
            this.router.navigate(['claim-request-manage']);
          }))
        }))
      }))
    } else {
      this.contractRequestService.setStatusRequest(this.claimRequest.id_request, this.description, this.approveStatus).subscribe((data => {
        this.contractRequestService.setStatusClaimRequest(this.claimRequest.id, this.description, this.approveStatus).subscribe((data => {
          let noti = new CustomerNotification(0, this.contract.id_customer, this.claimRequest.name, "Yêu cầu của bạn đã bị từ chối!", "list-request-customer", 1, new Date());
          this.contractRequestService.addOneNotification(noti).subscribe((noti => {
            this.spinner.hide();
            this.snackBar.openSnackBar("Xử Lý Yêu Cầu Thành Công", "Đóng");
            this.router.navigate(['claim-request-manage']);
          }))
        }))
      }))
    }
  }

}
