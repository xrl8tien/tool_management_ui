import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import jwt_decode from "jwt-decode";
import { CommonService } from 'src/app/services/common/common.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { SnackbarService } from 'src/app/services/snackbar/snackbar.service';

@Component({
  selector: 'app-notification-confirm-dialog',
  templateUrl: './notification-confirm-dialog.component.html',
  styleUrls: ['./notification-confirm-dialog.component.css']
})
export class NotificationConfirmDialogComponent implements OnInit {

  constructor(public customerService: CustomerService,
    @Inject(MAT_DIALOG_DATA) public id: number,
    private common: CommonService,
    public snackbar: SnackbarService,
    public dialogRef: MatDialogRef<NotificationConfirmDialogComponent>,
    private spinner:NgxSpinnerService) { }

  reason: string;

  ngOnInit(): void {
  }

  onSubmit(){
    this.spinner.show();
    this.customerService.updateContact(jwt_decode(this.common.getCookie('token_key'))['sub'], this.reason, this.id).subscribe((data => {

      this.spinner.hide();
    }));
  }

}
