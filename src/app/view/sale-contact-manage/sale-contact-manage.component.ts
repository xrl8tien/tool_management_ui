import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Contact } from 'src/app/model/Contact';
import jwt_decode from "jwt-decode";
import { CommonService } from 'src/app/services/common/common.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { NotificationConfirmDialogComponent } from '../dialog/notification-confirm-dialog/notification-confirm-dialog.component';
import { CustomerAddInfoDialogComponent } from '../dialog/customer-add-info-dialog/customer-add-info-dialog.component';
import { CustomerInfo } from 'src/app/model/CustomerInfo';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { Province } from 'src/app/model/Province';
import { District } from 'src/app/model/District';
import { element } from 'protractor';
import { data } from 'jquery';
import { ContactInfoDTO } from 'src/app/model/ContactInfoDTO';
import { DistrictDTO } from 'src/app/model/DistrictDTO';

@Component({
  selector: 'app-sale-contact-manage',
  templateUrl: './sale-contact-manage.component.html',
  styleUrls: ['./sale-contact-manage.component.css']
})
export class SaleContactManageComponent implements OnInit {


  constructor(public dialog: MatDialog,
    public customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private common: CommonService,
    public snackbar: SnackbarService,
    private employeeService: EmployeeService) { }

  district_name: string = "";
  page: number = 1;
  totalRecords: number;
  searchValue: String = "";
  dateFrom: Date;
  dateTo: Date;
  pageOld: number = 1;
  totalRecordsOld: number;
  searchValueOld: String = "";
  dateFromOld: Date;
  dateToOld: Date;
  pageDistrict: number = 1;
  totalRecordsDistrict: number;

  listId: Array<number>;
  listContact: Array<ContactInfoDTO>
  listContactOld: Array<ContactInfoDTO>
  listDistrict: Array<District>
  listDistrictDTO: Array<DistrictDTO> = []

  id_role = "";
  codes_sale: Array<string> = [];
  province_ex: Province;

  ngOnInit(): void {
    this.common.titlePage = "Danh S??ch Li??n H???";
    this.customerService.subsVar = this.customerService.
      callRefreshTable.subscribe((name: string) => {
        this.refresh();
      });
    this.refresh();
  }

  refresh() {
    this.spinner.show();
    this.employeeService.getAccByCode(this.common.getCookie('token_key')).subscribe((data => {
      this.id_role = data['id_role'];
      if (this.id_role == '2') {
        this.customerService.getAllDistrictByCodeSale(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((ids => {
          this.listId = ids;
          this.customerService.getDistrictNameById(this.listId).subscribe((data => {
            for (let i = 0; i < data.length; i++) {
              if (i < data.length - 1)
                this.district_name += " " + data[i].name + ", "
              else
                this.district_name += " " + data[i].name
            }
          }))
          this.customerService.getAllNewContactByDistrictIds(this.listId).subscribe((data => {
            this.listContact = data;
          }))
          this.customerService.getAllOldContactByDistrictIds(this.listId).subscribe((data => {
            this.listContactOld = data;
          }))
          this.spinner.hide();
        }))
      } else if (this.id_role == '5') {
        this.customerService.getProvinceByCodeEx(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((province => {
          this.province_ex = province;
          this.district_name = this.province_ex.name;
          this.customerService.getAllNewContactByProvince(this.province_ex.id).subscribe((data => {
            this.listContact = data;
          }))
          this.customerService.getAllOldContactByProvince(this.province_ex.id).subscribe((data => {
            this.listContactOld = data;
          }))
          this.listDistrictDTO = [];
          this.customerService.getAllDistrictByProvince(this.province_ex.id).subscribe((data => {
            this.listDistrict = data;
            for (let i = 0; i < this.listDistrict.length; i++) {
              this.customerService.getAllCodeSaleByDistrictId(this.listDistrict[i].id).subscribe((data => {
                let districtDTO = new DistrictDTO(
                  this.listDistrict[i].id,
                  this.listDistrict[i].name,
                  this.listDistrict[i].type,
                  this.listDistrict[i].id_province,
                  data
                )
                this.listDistrictDTO.push(districtDTO);
              }))
            }
            this.totalRecordsDistrict = this.listDistrictDTO.length;
          }))
          this.customerService.getAllCodeSaleByCodeEx(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((codes => {
            this.codes_sale = codes;
          }))
          this.spinner.hide();
        }))
      }
    }))
  }

  Search() {
    this.spinner.show();
    try {
      let dateTo1: String;
      let dateFrom1: String;
      let dateToValue = (<HTMLInputElement>document.getElementById('RtoSearch')).value;
      let dateFromValue = (<HTMLInputElement>document.getElementById('RfromSearch')).value;
      if (dateFromValue == "") {
        this.dateFrom = new Date('1990-01-01');
        dateFrom1 = this.dateFrom.getFullYear() + "-" + (this.dateFrom.getMonth() + 1) + "-" + this.dateFrom.getDate()
      } else {
        dateFrom1 = this.dateFrom.toString();
      }

      if (dateToValue == "") {
        this.dateTo = new Date();
        dateTo1 = this.dateTo.getFullYear() + "-" + (this.dateTo.getMonth() + 1) + "-" + this.dateTo.getDate()
      }
      else {
        dateTo1 = this.dateTo.toString();
      }
      let searchText = "%" + this.searchValue + "%";
      if (this.id_role == '2') {
        this.customerService.searchAllNewContact(this.listId, dateFrom1.toString(), dateTo1.toString(), searchText.toString()).subscribe((data => {
          this.listContact = data;
          this.totalRecords = this.listContact.length;
          this.spinner.hide();
          this.page = 1;
        }))
      } else if (this.id_role == '5') {
        this.customerService.searchAllNewContactByIdProvince(this.province_ex.id, dateFrom1.toString(), dateTo1.toString(), searchText.toString()).subscribe((data => {
          this.listContact = data;
          this.totalRecords = this.listContact.length;
          this.spinner.hide();
          this.page = 1;
        }))
      }
    } catch (error) {
      console.log(error);
    }
  }
  SearchOld() {
    this.spinner.show();
    try {
      let dateTo1: String;
      let dateFrom1: String;
      let dateToValue = (<HTMLInputElement>document.getElementById('RtoSearchOld')).value;
      let dateFromValue = (<HTMLInputElement>document.getElementById('RfromSearchOld')).value;
      if (dateFromValue == "") {
        this.dateFromOld = new Date('1990-01-01');
        dateFrom1 = this.dateFromOld.getFullYear() + "-" + (this.dateFromOld.getMonth() + 1) + "-" + this.dateFromOld.getDate()
      } else {
        dateFrom1 = this.dateFromOld.toString();
      }

      if (dateToValue == "") {
        this.dateToOld = new Date();
        dateTo1 = this.dateToOld.getFullYear() + "-" + (this.dateToOld.getMonth() + 1) + "-" + this.dateTo.getDate()
      }
      else {
        dateTo1 = this.dateToOld.toString();
      }
      let searchText = "%" + this.searchValueOld + "%";
      if (this.id_role == '2') {
        this.customerService.searchAllOldContact(this.listId, dateFrom1.toString(), dateTo1.toString(), searchText.toString()).subscribe((data => {
          this.listContactOld = data;
          this.totalRecordsOld = this.listContactOld.length;
          this.spinner.hide();
          this.pageOld = 1;
        }))
      } else if (this.id_role == '5') {
        this.customerService.searchAllOldContactByIdProvince(this.province_ex.id, dateFrom1.toString(), dateTo1.toString(), searchText.toString()).subscribe((data => {
          this.listContactOld = data;
          this.totalRecordsOld = this.listContactOld.length;
          this.spinner.hide();
          this.pageOld = 1;
        }))
      }
    } catch (error) {
      console.log(error);
    }
  }

  ResetDate() {
    this.dateFrom = null;
    this.dateTo = null;
  }

  ResetDateOld() {
    this.dateFromOld = null;
    this.dateToOld = null;
  }

  key = '';
  reverse: boolean = true;
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }

  public yesDialog(id: number) {
    let customerInfo = new CustomerInfo(0, new Date(), 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, 0, '', '', '', 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '', 0, 0, '', new Date(), 0, new Date(), '', 0);
    let dialogRef = this.dialog.open(CustomerAddInfoDialogComponent, {
      height: '80%',
      width: 'fit-content',
      data: customerInfo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.customerService.updateContact(jwt_decode(this.common.getCookie('token_key'))['sub'], '???? th??m v??o KHTN', id).subscribe((data => {
          if (data != null) {
            this.refresh();
            this.snackbar.openSnackBar("???? th??m v??o KHTN", "????ng");
          }
        }));
      }
    })
  }

  public noDialog(id: number) {
    let dialogRef = this.dialog.open(NotificationConfirmDialogComponent, {
      data: id
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.snackbar.openSnackBar("Li??n h??? ???? b??? t??? ch???i", "????ng");
        this.refresh();
      }
    })
  }

  Save() {
    this.customerService.deleteAllSaleDistrict(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
    }))
    this.listDistrictDTO.forEach((element => {
      this.customerService.updateSaleDistrict(element).subscribe((data => {
      }))
    }))
    this.snackbar.openSnackBar("???? l??u th??ng tin", "????ng");
    this.refresh();
  }

  countContact(id_district: number): number {
    let count = 0;
    this.listContact.forEach((element => {
      if (element.id_district == id_district) {
        count++;
      }
    }))
    return count;
  }

  checkKHTN(status: string): boolean {
    if (status == "???? th??m v??o KHTN") {
      return true;
    }
    return false;
  }

  calculateDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
  }

}
