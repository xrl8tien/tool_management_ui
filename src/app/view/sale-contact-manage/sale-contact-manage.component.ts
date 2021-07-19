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

@Component({
  selector: 'app-sale-contact-manage',
  templateUrl: './sale-contact-manage.component.html',
  styleUrls: ['./sale-contact-manage.component.css']
})
export class SaleContactManageComponent implements OnInit {

  customerInfo = new CustomerInfo(0, new Date(), 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, 0, 0, 0, '', '', '', 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '', 0, 0, '', new Date(), 0, new Date(), '', 0);

  constructor(public dialog: MatDialog,
    public customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private common: CommonService,
    public snackbar: SnackbarService) { }

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

  listId: Array<number>;
  listContact: Array<Contact>
  listContactOld: Array<Contact>

  ngOnInit(): void {
    this.customerService.subsVar = this.customerService.
      callRefreshTable.subscribe((name: string) => {
        this.refresh();
      });
    this.refresh();
  }

  refresh() {
    this.spinner.show();
    this.customerService.getAllDistrictByCodeSale(jwt_decode(this.common.getCookie('token_key'))['sub'])
      .subscribe((ids => {
        this.listId = ids;
        this.customerService.getDistrictNameById(this.listId).subscribe((data => {
          for (let i = 0; i < data.length; i++) {
            if (i < data.length - 1)
              this.district_name += " " + data[i] +", "
            else
              this.district_name += " " + data[i]
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
        dateTo1 = this.dateTo.getFullYear() + "-" + (this.dateTo.getMonth() + 1) + "-" + (this.dateTo.getDate() +1)
      }
      else {
        dateTo1 = this.dateTo.toString();
      }
      let searchText = "%" + this.searchValue + "%";
      this.customerService.searchAllNewContact(this.listId, dateFrom1.toString(), dateTo1.toString(), searchText.toString()).subscribe((data => {
        this.listContact = data;
        this.totalRecords = this.listContact.length;
        this.spinner.hide();
        this.page = 1;
      }))

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
        dateTo1 = this.dateToOld.getFullYear() + "-" + (this.dateToOld.getMonth() + 1) + "-" + (this.dateToOld.getDate() + 1)
      }
      else {
        dateTo1 = this.dateToOld.toString();
      }
      let searchText = "%" + this.searchValueOld + "%";
      this.customerService.searchAllOldContact(this.listId, dateFrom1.toString(), dateTo1.toString(), searchText.toString()).subscribe((data => {
        this.listContactOld = data;
        this.totalRecordsOld = this.listContactOld.length;
        this.spinner.hide();
        this.pageOld = 1;
      }))

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
    let dialogRef = this.dialog.open(CustomerAddInfoDialogComponent, {
      height: '80%',
      width: 'fit-content',
      data: this.customerInfo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.customerService.updateContact('Đã thêm vào KHTN', id).subscribe((data => {
          if (data != null) {
            this.refresh();
            this.snackbar.openSnackBar("Đã thêm vào KHTN", "Đóng");
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
        this.snackbar.openSnackBar("Liên hệ đã bị từ chối", "Đóng");
        this.refresh();
      }
    })
  }

  checkKHTN(status: string): boolean{
    if(status == "Đã thêm vào KHTN"){
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
