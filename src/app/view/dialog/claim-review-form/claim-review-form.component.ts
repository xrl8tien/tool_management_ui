import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Contract } from 'src/app/model/Contract';
import { Illustration } from 'src/app/model/Illustration';
import { Request } from 'src/app/model/Request';
import { Revenue } from 'src/app/model/Revenue';
import { ContractService } from 'src/app/services/contract/contract.service';
import { DetailCommissonService } from 'src/app/services/detailCommisson/detail-commisson.service';
import { IllustrationService } from 'src/app/services/illustration/illustration.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { RevenueService } from 'src/app/services/revenue/revenue.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { MainBenefitScale } from 'src/app/model/MainBenefitScale';
import { SubBenefitScale } from 'src/app/model/SubBenefitScale';
import { ContractrequestService } from 'src/app/services/contractRequest/contractrequest.service';
import { IllustrationSubBenifit } from 'src/app/model/IllustrationSubBenifit';
import { RelatedPersonInfo } from 'src/app/model/RelatedPersonInfo';
import { Benifit } from 'src/app/model/Benifit';
import { RequestClaimApprove } from 'src/app/model/RequestClaimApprove';
import { IllustrationMainBenifit } from 'src/app/model/IllustrationMainBenifit';
import { TemplatePortal } from '@angular/cdk/portal';
import { CustomerNotification } from 'src/app/model/CustomerNotification';

@Component({
  selector: 'app-claim-review-form',
  templateUrl: './claim-review-form.component.html',
  styleUrls: ['./claim-review-form.component.css']
})
export class ClaimReviewFormComponent implements OnInit {
  contract: Contract;
  approveStatus: string;
  amountMoney: number;
  description: string;
  requestClaim: RequestClaimApprove;
  listSubBenefitScale: Array<SubBenefitScale> = [];
  listSubScale: Array<SubBenefitScale> = [];
  listMainBenefitScale: Array<MainBenefitScale> = [];
  listSub: Array<IllustrationSubBenifit> = [];
  dateNow: Date;
  mainBenefit: IllustrationMainBenifit;
  value1 = 0;
  value2 = 0;
  main_benefit: string;
  sub_benefit: string;
  amount_main: number;
  amount_sub: number;
  listSubBenfitItem: Array<SubBenefitItem> = [];

  constructor(@Inject(MAT_DIALOG_DATA)
  public req: Request, public contractService: ContractService, private illustSer: IllustrationService,
    private snackBar: SnackbarService, private spinner: NgxSpinnerService,
    private contractRequestService: ContractrequestService, private router: Router) { }
  ngOnInit(): void {
    this.dateNow = new Date();
    this.contractService.getDetailContractForCustomer(this.req.id_contract).subscribe((data => {
      this.contract = data;
      this.illustSer.getAllSubBenefitById(this.contract.id_illustration).subscribe((data => {
        this.listSub = data;
        for (var i = 0; i < this.listSub.length; i++) {
          let subBenefitItem = new SubBenefitItem(this.listSub[i].denominations, []);
          this.illustSer.getAllSubBenefitScaleBySubBenefitId(this.listSub[i].id_sub_benifit).subscribe((data1 => {
            this.listSubScale = data1;
            for (var j = 0; j < this.listSubScale.length; j++) {
              let subBenefitScale = new SubBenefitScale(
                this.listSubScale[j].id,
                this.listSubScale[j].name,
                this.listSubScale[j].scale,
                this.listSubScale[j].id_sub_benefit
              )
              this.listSubBenefitScale.push(subBenefitScale);
            }
            subBenefitItem.listSubBenefitScale = this.listSubBenefitScale;
            this.listSubBenefitScale = [];
          }))
          this.listSubBenfitItem.push(subBenefitItem);
        }
      }))
      //lay illMainBenefit
      this.illustSer.getMainBenefitById(this.contract.id_illustration).subscribe((data => {
        this.mainBenefit = data;
      }))
      this.illustSer.getAllMainBenefitScaleByMainBenefitId(this.contract.id_main_benifit).subscribe((data => {
        this.listMainBenefitScale = data;
      }))
    }))
  }

  Review() {
    this.spinner.show();
    this.requestClaim = new RequestClaimApprove(0, this.req.name, this.dateNow, this.req.code_sender,
      this.description, this.req.id_contract, this.req.id, this.approveStatus, this.main_benefit, this.amount_main, this.sub_benefit, this.amount_sub);
    if (this.approveStatus == "DX") {
      this.contractRequestService.setStatusRequest(this.req.id, this.description, this.approveStatus).subscribe((data => {
        this.contractRequestService.addClaimRequest(this.requestClaim).subscribe((data => {
          let noti = new CustomerNotification(0, this.contract.id_customer, this.req.name, "Yêu cầu của bạn đã được đề xuất thanh toán!", "list-request-customer", 1, new Date());
          this.contractRequestService.addOneNotification(noti).subscribe((noti => {
            this.spinner.hide();
            this.snackBar.openSnackBar("Xử Lý Yêu Cầu Thành Công", "Đóng");
            this.router.navigate(['claim-request-manage']);
          }))
        }))
      }))
    } else if (this.approveStatus == "YCT") {
      this.contractRequestService.setStatusRequest(this.req.id, this.description, this.approveStatus).subscribe((data => {
        let noti = new CustomerNotification(0, this.contract.id_customer, this.req.name, "Yêu cầu của bạn cần bổ sung thêm tài liệu!", "list-request-customer", 1, new Date());
        this.contractRequestService.addOneNotification(noti).subscribe((noti => {
          this.spinner.hide();
          this.snackBar.openSnackBar("Xử Lý Yêu Cầu Thành Công", "Đóng");
          this.router.navigate(['claim-request-manage']);
        }))
      }))
    } else {
      this.contractRequestService.setStatusRequest(this.req.id, this.description, this.approveStatus).subscribe((data => {
        let noti = new CustomerNotification(0, this.contract.id_customer, this.req.name, "Yêu cầu của bạn đã bị từ chối!", "list-request-customer", 1, new Date());
        this.contractRequestService.addOneNotification(noti).subscribe((noti => {
          this.spinner.hide();
          this.snackBar.openSnackBar("Xử Lý Yêu Cầu Thành Công", "Đóng");
          this.router.navigate(['claim-request-manage']);
        }))
      }))
    }
  }

  handleChange1(value, name) {
    this.value1 = value;
    this.amountMoney = this.value2 + this.value1;
    this.amount_main = value;
    this.main_benefit = name;
  }

  handleChange2(value, name) {
    this.value2 = value;
    this.amountMoney = this.value2 + this.value1;
    this.amount_sub = value;
    this.sub_benefit = name;
  }
}

class SubBenefitItem {
  denominations: number;
  listSubBenefitScale: Array<SubBenefitScale>;
  constructor(
    denominations: number,
    listSubBenefitScale: Array<SubBenefitScale>,
  ) {
    this.denominations = denominations;
    this.listSubBenefitScale = listSubBenefitScale;
  }
}