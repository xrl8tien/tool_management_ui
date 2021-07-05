import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';

@Component({
  selector: 'app-claim-submit-form',
  templateUrl: './claim-submit-form.component.html',
  styleUrls: ['./claim-submit-form.component.css']
})
export class ClaimSubmitFormComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  public exportPDF() {
    var data = document.getElementById('mat-typography');
    html2canvas(data).then(canvas => {
      let imgWidth = 208;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentUrl = canvas.toDataURL('img/png')
      let pdf = new jspdf('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentUrl, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('Thongtinbosung.pdf');
    });
  }

}
