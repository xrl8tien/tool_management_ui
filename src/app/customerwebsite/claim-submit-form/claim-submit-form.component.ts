import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerAttachment } from 'src/app/model/CustomerAttachment';
import { Request } from 'src/app/model/Request';
import { RequestAttachment } from 'src/app/model/RequestAttachment';
import { AuthenService } from 'src/app/services/authen/authen.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ContractService } from 'src/app/services/contract/contract.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { FileManagementService } from 'src/app/services/fileManagement/file-management.service';
import { RefertableService } from 'src/app/services/refertable/refertable.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { ContractrequestService } from 'src/app/services/contractRequest/contractrequest.service';
import { CustomerWebServiceService } from 'src/app/services/customer-web-service/customer-web-service.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { ContractDTO } from 'src/app/model/ContractDTO';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Contract } from 'src/app/model/Contract';
import { SubBenefitScale } from 'src/app/model/SubBenefitScale';
import { MainBenefitScale } from 'src/app/model/MainBenefitScale';
import { IllustrationService } from 'src/app/services/illustration/illustration.service';
import { CustomerInfo } from 'src/app/model/CustomerInfo';
import moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { async } from 'rxjs/internal/scheduler/async';
import { RequestClaimDetail } from 'src/app/model/RequestClaimDetail';
import { RequestMedicalInformation } from 'src/app/model/RequestMedicalInformation';
import { RequestClaimBenefit } from 'src/app/model/RequestClaimBenefit';

@Component({
  selector: 'app-claim-submit-form',
  templateUrl: './claim-submit-form.component.html',
  styleUrls: ['./claim-submit-form.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClaimSubmitFormComponent implements OnInit {
  code_sender: string;
  id_contract: number;
  name: string;
  listDocument = new Array<RequestAttachment>();
  payment_period: string;
  selectedFile = new Array<File>();
  req: Request;
  listContracts: Array<ContractDTO>;
  selectContract: FormControl = new FormControl();
  selectBenefit: FormControl = new FormControl();
  listMainBenefitScale: Array<MainBenefitScale> = [];

  fullName: string;
  id_card: string;
  address: string;
  phoneNo: string;
  format1: string = "";
  date: any;
  email: string;
  customerInfoList: Array<CustomerInfo>;
  customerInfo: CustomerInfo;
  options: boolean;
  day_happen: any;
  inputEmail2: any;
  inputPhone2: any;
  inputAddress2: any;
  inputCMND2: any;
  birthday2: any;
  inputName2: any;
  inputFileName: any;
  deathReason: any;
  inputDateDeath: any;
  deathPlace: any;
  inputDateAccident: any;
  accidentPlace: any;
  accidentDetail: any;
  injuryStatus: any;

  listMainBenefit = [];
  listSubBenefit = [];
  selectedMain: any;
  selectedSub: any;

  constructor(private snackBar: SnackbarService, private cusService: CustomerService, private illustSer: IllustrationService,
    private fileService: FileManagementService, private reqService: ContractrequestService,
    private common: CommonService, private spinner: NgxSpinnerService,
    private referTable: RefertableService, public authenService: AuthenService,
    private route: ActivatedRoute, private router: Router, private contractService: ContractService,
    private dialog: MatDialog, private EmAccService: EmployeeService) {
    let now = moment().format("DD-MM-YYYY");
    this.format1 = now;
  }

  ngOnInit(): void {
    let token_customer = this.common.getCookie('token_customer');
    if (!token_customer) {
      this.router.navigate(['login-customerweb']);
    } else {
      this.code_sender = this.common.getCookie('name_customer');
      this.contractService.getAllContractForCustomer(jwt_decode(this.common.getCookie('token_customer'))['sub']).subscribe((data => {
        this.listContracts = data;
      }));
      this.cusService.getOneInfoCustomer(jwt_decode(this.common.getCookie('token_customer'))['sub']).subscribe((data => {
        this.customerInfoList = data;
        this.customerInfo = this.customerInfoList[0];
        this.fullName = this.customerInfo.full_name;
        this.id_card = this.customerInfo.id_card;
        this.address = this.customerInfo.conadd_no_street + " , " + this.customerInfo.conadd_district + " , " + this.customerInfo.conadd_city;
        this.phoneNo = this.customerInfo.phone_1;
        this.email = this.customerInfo.email;
      }))
    }
  }

  row: Array<RequestMedicalInformation> = [];
  newItem: RequestMedicalInformation = new RequestMedicalInformation(0, null, null, null, null, null);


  addTable() {
    if (this.newItem.date_in != null && this.newItem.date_out != null && this.newItem.diagnosis_disease != null && this.newItem.name_hospital != null) {
      this.row.push(this.newItem);
    } else {
      alert("Không được để trống!");
    }
    this.newItem = new RequestMedicalInformation(0, null, null, null, null, null);
  }

  deleteRow(x) {
    // var delBtn = confirm(" Do you want to delete ?");
    // if (delBtn == true) {

    if (this.row.length <= 1) {
      alert("Không thể xoá!");
    } else {
      this.row.splice(x, 1);
    }
    // }
  }

  //hàm đầu tiên sử dụng async-await sau nên dùng hàm này để phát triển https://viblo.asia/p/async-await-trong-angular-gGJ59o7GZX2
  async onChangeContract(id_contract: number) {
    let tmpMain = [];
    let tmpSub = [];
    this.listMainBenefit = [];
    this.listSubBenefit = [];
    let contract = await this.cusService.getDetailContractForCustomer(id_contract).toPromise();
    let listSubBenefit = await this.cusService.getAllSubBenefitById(contract.id_illustration).toPromise();
    for (var i = 0; i < listSubBenefit.length; i++) {
      let listSubBenefitScale = await this.cusService.getAllSubBenefitScaleBySubBenefitId(listSubBenefit[i].id_sub_benifit).toPromise();
      for (var j = 0; j < listSubBenefitScale.length; j++) {
        tmpSub.push(listSubBenefitScale[j].name)
      }
    }
    this.listSubBenefit = tmpSub;
    let listMainBenefitScale = await this.cusService.getAllMainBenefitScaleByMainBenefitId(contract.id_main_benifit).toPromise();
    for (let i = 0; i < listMainBenefitScale.length; i++) {
      tmpMain.push(listMainBenefitScale[i].name);
    }
    this.listMainBenefit = tmpMain;
  }

  dowloadPDF() {
    window.print();
  }

  onChangeFile(event) {
    if (event.target.files[0].size > 1048576) {
      this.snackBar.openSnackBar("Dung Lượng File Cần Nhỏ Hơn Hoặc Bằng 1Mb", "Đóng");
      return;
    }
    this.selectedFile.push(event.target.files[0]);
  }

  removeFile(index: number) {
    if (index > -1) {
      this.selectedFile.splice(index, 1)
    }
  }

  sendReq() {
    this.spinner.show();
    this.req = new Request(0, this.name, 2, new Date(), 1, this.code_sender, '', '', 'Cao', this.selectContract.value, 'CXD');
    if (this.selectedFile.length != 0) {
      this.cusService.addOneCustomerRequest(this.req).subscribe((reqData => {
        //upload file đính kèm
        const uploadImageData = new FormData();
        this.selectedFile.forEach(file => {
          uploadImageData.append('fileData', file, file.name);
        });
        this.cusService.uploadCustomerFileRequest(uploadImageData).subscribe((data => {
          if (data['body'] != null) {
            let listFileSave = Array<RequestAttachment>();
            for (let i = 0; i < this.selectedFile.length; i++) {
              listFileSave.push(new RequestAttachment(data['body'][i][1], this.selectedFile[i].name, data['body'][i][0], reqData.id));
            }
            this.cusService.saveCustomerFileRequest(listFileSave).subscribe((data1 => {
            }))
          }
        }))
        //add request detail
        let requestClaimDetail = new RequestClaimDetail(0, reqData.id, this.inputDateDeath, this.deathReason,
          this.deathPlace, this.inputDateAccident, this.accidentDetail, this.accidentPlace, this.injuryStatus,
          this.inputName2, this.birthday2, this.inputCMND2, this.inputAddress2, this.inputPhone2, this.inputEmail2,
          this.selectedMain, this.selectedSub);
        this.cusService.addOneRequestClaimDetail(requestClaimDetail).subscribe((reqClaimDetail => {
          this.row.forEach(requestMedicalInformation => {
            requestMedicalInformation.id_request_claim_detail = reqClaimDetail.id;
            this.cusService.addOneRequestMedicalInformation(requestMedicalInformation).subscribe((data => {
            }))
          });
        }))
        this.spinner.hide();
        this.snackBar.openSnackBar("Gửi Yêu Cầu Thành Công", "Đóng");
        this.router.navigate(['list-request-customer']);
      }))
    } else {
      this.spinner.hide();
      this.snackBar.openSnackBar("Vui Lòng Chọn Ít Nhất 1 File Để Tải Lên", "Đóng");
    }
  }
}
