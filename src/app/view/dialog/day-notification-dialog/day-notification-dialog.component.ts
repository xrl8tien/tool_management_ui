import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contract } from 'src/app/model/Contract';
import jwt_decode from "jwt-decode";
import { CustomerInfo } from 'src/app/model/CustomerInfo';
import { CustomerNotification } from 'src/app/model/CustomerNotification';
import { ContractrequestService } from 'src/app/services/contractRequest/contractrequest.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';
import { CommonService } from 'src/app/services/common/common.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { element } from 'protractor';
import { NotificationSetting } from 'src/app/model/NotificationSetting';
import { ContractService } from 'src/app/services/contract/contract.service';

@Component({
  selector: 'app-day-notification-dialog',
  templateUrl: './day-notification-dialog.component.html',
  styleUrls: ['./day-notification-dialog.component.css']
})
export class DayNotificationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { listBirthdayCus: Array<CustomerInfo>, listExpiredContract: Array<Contract> },
    private contractRequestService: ContractrequestService, private snackBar: SnackbarService, private customerService: CustomerService,
    private common: CommonService, private contractService: ContractService) { }

  type: number;
  title: string;
  description: string;
  url: string = "";

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  notificationSetting: NotificationSetting = new NotificationSetting(0, jwt_decode(this.common.getCookie('token_key'))['sub'], 30);

  ngOnInit(): void {
    let tmp = [];
    this.contractService.getNotificationSetting(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
      if (data != null) {
        this.notificationSetting = data;
      }
    }))
    this.customerService.getAllCustomerInfo(jwt_decode(this.common.getCookie('token_key'))['sub']).subscribe((data => {
      for (let i = 0; i < data.length; i++) {
        tmp.push({ item_id: data[i].id, item_text: "#KH" + data[i].id + "|" + data[i].full_name });
      }
      this.dropdownList = tmp;
    }))
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Ch???n T???t C???',
      unSelectAllText: 'H???y Ch???n T???t C???',
      searchPlaceholderText: 'T??m ki???m',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  }

  onItemSelect(item: any) {
    this.selectedItems.push(item);
    console.log(item);
  }
  onItemDeSelect(item: any) {
    this.selectedItems.forEach((value, index) => {
      if (value.item_id == item.item_id) {
        this.selectedItems.splice(index, 1)
      }
    })
    console.log(item);
  }
  onSelectAll(items: any) {
    this.selectedItems = items;
    console.log(items);
  }
  onItemDeSelectAll(items: any) {
    this.selectedItems = [];
    console.log(items);
  }

  sendBirthdayNotification(id: number) {
    let noti = new CustomerNotification(0, id, "Ch??c m???ng sinh nh???t kh??ch h??ng",
      "Ch??c m???ng Anh/Ch??? sinh nh???t vui v???, nhi???u s???c kh???e v?? h???nh ph??c. Ch??c Anh/Ch??? th??m tu???i m???i g???t h??i ???????c nhi???u th??nh c??ng trong s??? nghi???p, gia ????nh h???nh ph??c vui v???", "", 4, new Date());
    this.contractRequestService.addOneNotification(noti).subscribe((noti => {
      this.snackBar.openSnackBar("G???i Th??ng B??o Th??nh C??ng", "????ng");
    }))
  }

  sendPaymentNotification(contract: Contract) {
    let noti = new CustomerNotification(0, contract.id_customer, "Nh???c nh??? ????ng ti???n h???p ?????ng",
      "H???p ?????ng #HD" + contract.id + "-" + contract.insurance_type + " c???a qu?? kh??ch s???p ?????n h???n n???p ti???n. Qu?? kh??ch vui l??ng ????ng ti???n ????ng h???n theo h???p ?????ng!", "contract-customerweb", 2, new Date());
    this.contractRequestService.addOneNotification(noti).subscribe((noti => {
      this.contractService.sendNotificationEmail(contract).subscribe((email => {
        this.snackBar.openSnackBar("G???i Th??ng B??o Th??nh C??ng", "????ng");
      }))
    }))
  }

  sendNotification() {
    if (this.type == 1) {
      this.url = "list-request-customer"
    }
    this.selectedItems.forEach(element => {
      let noti = new CustomerNotification(0, element.item_id, this.title,
        this.description, this.url, this.type, new Date());
      this.contractRequestService.addOneNotification(noti).subscribe((noti => {
        this.ngOnInit();
        this.snackBar.openSnackBar("G???i Th??ng B??o Th??nh C??ng", "????ng");
      }))
    })
  }

  saveSetting() {
    if (this.notificationSetting.date_setting >= 3 && this.notificationSetting.date_setting <= 30) {
      this.contractService.updateNotificationSetting(this.notificationSetting).subscribe((data => {
        this.ngOnInit();
        this.snackBar.openSnackBar("L??u C??i ?????t Th??nh C??ng", "????ng");
      }))
    } else {
      this.snackBar.openSnackBar("Ng??y C??i ?????t Ph???i N???m Trong Kho???ng 3 ?????n 30 Ng??y", "????ng");
    }
  }

  paymentPeriod(payment_id: number): string {
    switch (payment_id) {
      case 1: return "N??m"; break;
      case 2: return "N???a N??m"; break;
      case 3: return "Qu??"; break;
      case 4: return "Th??ng"; break;
    }
  }

}
