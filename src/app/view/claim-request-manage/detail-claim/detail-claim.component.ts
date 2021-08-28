import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Contract } from 'src/app/model/Contract';
import { CustomerInfo } from 'src/app/model/CustomerInfo';
import { Request } from 'src/app/model/Request';
import { CommonService } from 'src/app/services/common/common.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { ContractrequestService } from 'src/app/services/contractRequest/contractrequest.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { AppraiserReviewFormComponent } from '../../dialog/appraiser-review-form/appraiser-review-form.component';
import { ContractDetailDialogComponent } from '../../dialog/contract-detail-dialog/contract-detail-dialog.component';
import { IllustrationDetailDialogComponent } from '../../dialog/illustration-detail-dialog/illustration-detail-dialog.component';
import jwt_decode from "jwt-decode";
import { IllustrationService } from 'src/app/services/illustration/illustration.service';
import { RelatedPersonInfo } from 'src/app/model/RelatedPersonInfo';
import { IllustrationSubBenifit } from 'src/app/model/IllustrationSubBenifit';
import { Illustration } from 'src/app/model/Illustration';
import { FileManagementService } from 'src/app/services/fileManagement/file-management.service';
import { CustomerAttachment } from 'src/app/model/CustomerAttachment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Benifit } from 'src/app/model/Benifit';
import { BenifitService } from 'src/app/services/benifit/benifit.service';
import { ClaimReviewFormComponent } from '../../dialog/claim-review-form/claim-review-form.component';
import { RequestAttachment } from 'src/app/model/RequestAttachment';
import { MainBenefitScale } from 'src/app/model/MainBenefitScale';
import { SubBenefitScale } from 'src/app/model/SubBenefitScale';
import { IllustrationMainBenifit } from 'src/app/model/IllustrationMainBenifit';
import { RequestClaimDetail } from 'src/app/model/RequestClaimDetail';
import { RequestMedicalInformation } from 'src/app/model/RequestMedicalInformation';

@Component({
  selector: 'app-detail-claim',
  templateUrl: './detail-claim.component.html',
  styleUrls: ['./detail-claim.component.css']
})
export class DetailClaimComponent implements OnInit {
  listSubBenifit: Array<Benifit>;
  listDocument = new Array<CustomerAttachment>();
  listClaimDocument = new Array<RequestAttachment>();
  illustration: Illustration;
  illustrationCopy: Illustration;
  listRelatedPersonNumber: Number[] = [];
  listSubRelatedPerSonBig: Array<any> = [];
  listSubRelatedPerSonSmall: IllustrationSubBenifit[] = [];
  listRelatedPerSonInfo: Array<RelatedPersonInfo> = [];
  illustrationSubBenefit: IllustrationSubBenifit;
  listSubBenefitScale: Array<SubBenefitScale> = [];
  listMainBenefitScale: Array<MainBenefitScale> = [];
  listSub: Array<IllustrationSubBenifit> = [];

  status: boolean = false;
  req: Request;
  reqClaimDetail: RequestClaimDetail;
  listReqMed: Array<RequestMedicalInformation>;
  contract: Contract;
  custInfo: Array<CustomerInfo>;
  mainBenefit: IllustrationMainBenifit;
  listSubScale: Array<SubBenefitScale> = [];
  listSubBenfitItem: Array<SubBenefitItem> = [];

  constructor(private common: CommonService, private benifitSer: BenifitService, private illustrationService: IllustrationService, private custService: CustomerService,
    private contractService: ContractService, private dialog: MatDialog, private fileService: FileManagementService, private spinner: NgxSpinnerService,
    private contractRequestService: ContractrequestService, private activateRoute: ActivatedRoute) { }



  ngOnInit(): void {
    this.spinner.show();
    this.contractRequestService.getOneContractRequest(this.activateRoute.snapshot.params['id']).subscribe((data => {
      this.req = data;
      // đề phòng user nhập các id khác nhau trên đường dẫn
      let data1 = this.req.id_contract;
      this.contractService.getDetailContractForCustomer(data1).subscribe((data1 => {
        this.contract = data1;

        // Start Lấy detail contract
        this.illustrationService.getIllustrationContractCreate(this.contract.id_illustration).subscribe((data => {
          this.illustration = data;
          this.illustrationCopy = data;

          if (this.illustration.illustrationSubBenifitList.length != 0) {
            //Biến đếm số lượng người 
            var default_number: number = this.illustration.illustrationSubBenifitList[0].id_related_person;
            //tìm số lượng người bảo hiểm phụ và thông tin chi tiết
            for (let i = 0; i < this.illustration.illustrationSubBenifitList.length; i++) {
              if (this.illustration.illustrationSubBenifitList[i].id_related_person == default_number) {
                this.listRelatedPersonNumber.push(default_number);
                let relatedPerson = new RelatedPersonInfo(
                  this.illustration.illustrationSubBenifitList[i].full_name_insured_persion_extra,
                  this.illustration.illustrationSubBenifitList[i].insurance_buyer_relation_extra_insured_person,
                  this.illustration.illustrationSubBenifitList[i].dob_extra_insured_person,
                  this.illustration.illustrationSubBenifitList[i].gender_extra_insured_person,
                  this.illustration.illustrationSubBenifitList[i].carrier_group_extra_insured_person,
                );
                this.listRelatedPerSonInfo.push(relatedPerson);
                default_number++;
              }
            }

            // console.log(this.illustration.illustrationSubBenifitList.find(i => i.id_related_person == 1)['id_related_person']);

            //Duyệt qua từng người được bảo hiểm bổ sung
            for (let k = 0; k < this.listRelatedPersonNumber.length; k++) {

              let listSubRelatedPerSonSmall: Array<IllustrationSubBenifit> = [];
              let count: number = 0;
              let id_related_person = this.illustrationCopy.illustrationSubBenifitList[0].id_related_person;

              //tìm những thông tin có related id = nhau
              for (let i = 0; i < this.illustrationCopy.illustrationSubBenifitList.length; i++) {
                if (this.illustrationCopy.illustrationSubBenifitList[i].id_related_person == id_related_person) {
                  listSubRelatedPerSonSmall.push(this.illustrationCopy.illustrationSubBenifitList[i]);
                  count = count + 1;
                }
              }
              this.listRelatedPerSonInfo[k].listSubInterset = listSubRelatedPerSonSmall;
              this.listSubRelatedPerSonBig.push(listSubRelatedPerSonSmall);
              //tìm mảng với những giá trị của người liên quan còn lại
              this.illustrationCopy.illustrationSubBenifitList = this.illustrationCopy.illustrationSubBenifitList.slice(count, this.illustrationCopy.illustrationSubBenifitList.length);
            }
          }

          this.benifitSer.getAllSubBenifit().subscribe((data => {
            this.listSubBenifit = data;
          }))

          this.fileService.getFile(this.contract.id).subscribe((data => {
            this.listDocument = data;
            this.spinner.hide();
          }))
          this.fileService.getFileRequest(this.req.id).subscribe((data => {
            this.listClaimDocument = data;
            this.spinner.hide();
          }))
        }))
        // End Lấy detail contract

        this.benifitSer.getAllSubBenifit().subscribe((data => {
          this.listSubBenifit = data;
        }))


        this.custService.getDetailCustomerInfoAdmin(this.contract.id_customer).subscribe((data2 => {
          this.custInfo = data2;
        }))

        this.illustrationService.getAllSubBenefitById(this.contract.id_illustration).subscribe((data => {
          this.listSub = data;
          for (var i = 0; i < this.listSub.length; i++) {
            let subBenefitItem = new SubBenefitItem(this.listSub[i].denominations, []);
            this.illustrationService.getAllSubBenefitScaleBySubBenefitId(this.listSub[i].id_sub_benifit).subscribe((data1 => {
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
        this.illustrationService.getMainBenefitById(this.contract.id_illustration).subscribe((data => {
          this.mainBenefit = data;
        }))
  
        this.illustrationService.getAllMainBenefitScaleByMainBenefitId(this.contract.id_main_benifit).subscribe((data => {
          this.listMainBenefitScale = data;
        }))

      }))
      this.contractRequestService.getRequestClaimDetail(this.req.id).subscribe((data => {
        this.reqClaimDetail = data;
        this.contractRequestService.getRequestMedicalInformation(this.reqClaimDetail.id).subscribe((data1 => {
          this.listReqMed = data1;
        }))
      }))
    }))

    this.spinner.hide();

  }

  displayConfirmDialog(): void {
    let dialogRef = this.dialog.open(ClaimReviewFormComponent, { data: this.req });
    dialogRef.afterClosed().subscribe(result => {
    })
  }

  contractDetail: Contract;
  public openDialogContractDetail(id_contract: number) {
    this.contractService.getDetailContract(id_contract).subscribe((dataReturn => {
      this.contractDetail = dataReturn;
      let dialogRef = this.dialog.open(ContractDetailDialogComponent, {
        height: '80%',
        width: '50%',
        data: this.contract
      });
    }))
  }

  openillustrationDetailDialog(id_illustration: number) {
    let dialogRef = this.dialog.open(IllustrationDetailDialogComponent, {
      height: '80%',
      width: 'fit-content',
      data: id_illustration
    });
  }

  dowloadPDF() {
    window.print();
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
