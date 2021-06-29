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

@Component({
  selector: 'app-claim-review-form',
  templateUrl: './claim-review-form.component.html',
  styleUrls: ['./claim-review-form.component.css']
})
export class ClaimReviewFormComponent implements OnInit {

  contract: Contract;
  illustrationCopy: Illustration;
  revenue = new Revenue(0, '', 0, 0, 0, new Date());
  illustration: Illustration;
  approveStatus: string;
  listRelatedPersonNumber: Number[] = [];
  listSubRelatedPerSonBig: Array<any> = [];
  listSubRelatedPerSonSmall: IllustrationSubBenifit[] = [];
  listRelatedPerSonInfo: Array<RelatedPersonInfo> = [];
  listSubBenifit: Array<Benifit> = [];
  illustrationSubBenefit: IllustrationSubBenifit;
  listSubBenefitScale: Array<SubBenefitScale> = [];
  listMainBenefitScale: Array<MainBenefitScale> = [];
  listSub: Array<IllustrationSubBenifit> = [];

  constructor(@Inject(MAT_DIALOG_DATA)
  public req: Request, public contractService: ContractService, private revenueSer: RevenueService,
    private commissionSer: DetailCommissonService, private custService: CustomerService,
    private illustSer: IllustrationService, private snackBar: SnackbarService, private spinner: NgxSpinnerService,
    private contractRequestService: ContractrequestService, private activateRoute: ActivatedRoute,
    private router: Router) { }
  description: String;
  ngOnInit(): void {
    this.approveStatus = "DD";


    let data1 = this.req.id_contract;
    this.contractService.getDetailContractForCustomer(data1).subscribe((data1 => {
      this.contract = data1;

      this.illustSer.getAllSubBenefitById(this.contract.id_illustration).subscribe((data => {
        this.listSub = data;
        this.illustSer.getAllSubBenefitScaleBySubBenefitId(this.listSub[0].id_sub_benifit).subscribe((data => {
          this.listSubBenefitScale = data;
        }))
      }))

      this.illustSer.getAllMainBenefitScaleByMainBenefitId(this.contract.id_main_benifit).subscribe((data => {
        this.listMainBenefitScale = data;
      }))

    }))


  }

  Review() {
    this.spinner.show();
    if (this.approveStatus == "DX") {
      this.contractService.setStatusContract(this.req.id_contract, this.req.id, this.description, this.approveStatus).subscribe((data => {
        // set trạng thái cho hợp đồng và request
        let data1 = { id: this.req.id_contract, code: this.req.code_sender };
        this.contractService.getDetailContract(data1).subscribe((data => {
          // lấy tất cả thông tin của bảng minh họa
          this.illustSer.getIllustrationContractCreate(data['id_illustration']).subscribe((data => {
            this.illustration = data;
            let dataCommission = {
              payment_period_id: data['payment_period_id'],
              denomination: data['illustrationMainBenifit'].denominations
            }
            // lấy hệ số commisson để tính thu nhập cho nhân viên
            this.commissionSer.getOneCommisson(dataCommission).subscribe((data => {
              this.revenue.id_contract = this.req.id_contract;
              this.revenue.code_employee = this.req.code_sender;
              this.revenue.income = data['commission'] * this.illustration.total_fee;
              // if(this.illustration.illustrationMainBenifit.denominations != 0){
              //   if(this.illustration.illustrationSubBenifitList != null){
              //     this.revenue.revenue_val = this.revenue.revenue_val+this.illustration.illustrationMainBenifit.denominations;
              //     this.illustration.illustrationSubBenifitList.forEach(a => this.revenue.revenue_val += a.denominations)
              //   } else {
              //     this.revenue.revenue_val = this.illustration.illustrationMainBenifit.denominations;
              //   }

              // }else {
              //   this.revenue.revenue_val = 0;
              // }
              // doanh thu của 1 hợp đồng sẽ bằng tổng phí bảo hiểm đóng theo kỳ hạn
              this.revenue.revenue_val = this.illustration.total_fee;
              // gửi thông tin tài khoản và password cho khách hàng khi xét duyệt hợp đồng lần đầu tiên
              this.custService.sendOneAccCustomer((this.illustration.id_customer_info)).subscribe((data => {
                this.revenueSer.addOneRevenue(this.revenue).subscribe((data => {
                  this.spinner.hide();
                  this.snackBar.openSnackBar("Xử Lý Yêu Cầu Thành Công", "Đóng");
                  this.router.navigate(['appraiser-request-manage']);
                }))
              }))
            }))
          }))
        }))
      }))
    }
    else {
      this.contractService.setStatusContract(this.req.id_contract, this.req.id, this.description, this.approveStatus).subscribe((data => {
        this.spinner.hide();
        this.snackBar.openSnackBar("Xử Lý Yêu Cầu Thành Công", "Đóng");
        this.router.navigate(['appraiser-request-manage']);
      }))
    }
  }
}
