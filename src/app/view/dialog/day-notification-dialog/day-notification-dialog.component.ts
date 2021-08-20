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
      selectAllText: 'Chọn Tất Cả',
      unSelectAllText: 'Hủy Chọn Tất Cả',
      searchPlaceholderText: 'Tìm kiếm',
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
    let noti = new CustomerNotification(0, id, "Chúc mừng sinh nhật khách hàng",
      "Chúc mừng Anh/Chị sinh nhật vui vẻ, nhiều sức khỏe và hạnh phúc. Chúc Anh/Chị thêm tuổi mới gặt hái được nhiều thành công trong sự nghiệp, gia đình hạnh phúc vui vẻ", "", 4, new Date());
    this.contractRequestService.addOneNotification(noti).subscribe((noti => {
      this.snackBar.openSnackBar("Gửi Thông Báo Thành Công", "Đóng");
    }))
  }

  sendPaymentNotification(contract: Contract) {
    let noti = new CustomerNotification(0, contract.id_customer, "Nhắc nhở đóng tiền hợp đồng",
      "Hợp đồng #HD" + contract.id + "-" + contract.insurance_type + " của quý khách sắp đến hạn nộp tiền. Quý khách vui lòng đóng tiền đúng hạn theo hợp đồng!", "contract-customerweb", 2, new Date());
    this.contractRequestService.addOneNotification(noti).subscribe((noti => {
      this.contractService.sendNotificationEmail(contract).subscribe((email => {
        this.snackBar.openSnackBar("Gửi Thông Báo Thành Công", "Đóng");
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
        this.snackBar.openSnackBar("Gửi Thông Báo Thành Công", "Đóng");
      }))
    })
  }

  saveSetting() {
    if (this.notificationSetting.date_setting >= 3 && this.notificationSetting.date_setting <= 30) {
      this.contractService.updateNotificationSetting(this.notificationSetting).subscribe((data => {
        this.ngOnInit();
        this.snackBar.openSnackBar("Lưu Cài Đặt Thành Công", "Đóng");
      }))
    } else {
      this.snackBar.openSnackBar("Ngày Cài Đặt Phải Nằm Trong Khoảng 3 Đến 30 Ngày", "Đóng");
    }
  }

  paymentPeriod(payment_id: number): string {
    switch (payment_id) {
      case 1: return "Năm"; break;
      case 2: return "Nửa Năm"; break;
      case 3: return "Quý"; break;
      case 4: return "Tháng"; break;
    }
  }

}
