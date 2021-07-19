import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contract } from 'src/app/model/Contract';
import { CustomerInfo } from 'src/app/model/CustomerInfo';
import { CustomerNotification } from 'src/app/model/CustomerNotification';
import { ContractrequestService } from 'src/app/services/contractRequest/contractrequest.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-day-notification-dialog',
  templateUrl: './day-notification-dialog.component.html',
  styleUrls: ['./day-notification-dialog.component.css']
})
export class DayNotificationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { listBirthdayCus: Array<CustomerInfo>, listExpiredContract: Array<Contract> },
    private contractRequestService: ContractrequestService, private snackBar: SnackbarService) { }

  ngOnInit(): void {
  }

  sendBirthdayNotification(id: number) {
    let noti = new CustomerNotification(0, id, "Chúc mừng sinh nhật khách hàng",
      "Chúc mừng Anh/Chị sinh nhật vui vẻ, nhiều sức khỏe và hạnh phúc. Chúc Anh/Chị thêm tuổi mới gặt hái được nhiều thành công trong sự nghiệp, gia đình hạnh phúc vui vẻ", "", 1, new Date());
    this.contractRequestService.addOneNotification(noti).subscribe((noti => {
      this.snackBar.openSnackBar("Gửi Thông Báo Thành Công", "Đóng");
    }))
  }

  sendPaymentNotification(id: number) {
    let noti = new CustomerNotification(0, id, "Hợp đồng của quý khách sắp đến hạn nộp tiền",
      "Quý khách vui lòng đóng tiền đúng hạn theo hợp đồng!", "", 1, new Date());
    this.contractRequestService.addOneNotification(noti).subscribe((noti => {
      this.snackBar.openSnackBar("Gửi Thông Báo Thành Công", "Đóng");
    }))
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
