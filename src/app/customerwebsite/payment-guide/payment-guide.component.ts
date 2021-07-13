import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationPaymentComponent } from './notification-payment/notification-payment.component';
import { PaymentByCashComponent } from './payment-by-cash/payment-by-cash.component';
import { PaymentByCreditCardComponent } from './payment-by-credit-card/payment-by-credit-card.component';
import { PaymentDirectlyComponent } from './payment-directly/payment-directly.component';

@Component({
  selector: 'app-payment-guide',
  templateUrl: './payment-guide.component.html',
  styleUrls: ['./payment-guide.component.css']
})
export class PaymentGuideComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openDialog() {
    const dialogRef = this.dialog.open(NotificationPaymentComponent);
  }

  openDialog1() {
    const dialogRef1 = this.dialog.open(PaymentByCreditCardComponent);
  }

  openDialog2() {
    const dialogRef2 = this.dialog.open(PaymentDirectlyComponent);
  }

  openDialog3() {
    const dialogRef3 = this.dialog.open(PaymentByCashComponent);
  }

}
