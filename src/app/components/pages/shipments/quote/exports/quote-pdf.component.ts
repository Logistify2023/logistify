import { Component, OnInit, Input} from '@angular/core';
import { ShipmentsService } from 'src/app/services/shipments.service';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-quote-pdf',
  templateUrl: './quote-pdf.component.html',
  styleUrls: []
})
export class QuotePdfComponent implements OnInit {

  quotePdfData: any = {};
 

  @Input() idParaPdf: any;

  constructor(
    private apiShipments: ShipmentsService,
  ) { }

  ngOnInit(): void {
  }

  quotePdf(id: any){
    this.apiShipments.getQuote(this.idParaPdf.id).subscribe((e: any) => {
      if (e.result) {
        this.quotePdfData = e.data;
        console.log('pdf' +  this.quotePdfData);
      } else {
        console.log('error');
        // this.toastr.error(e.message, 'Error', {
        //   timeOut: 3000,
        //   enableHtml: true
        // });
      }
    }, (err: any) => {
      // this.toastr.error(err.error.message, 'Error', {
      //   timeOut: 3000,
      //   enableHtml: true
      // });
    });
  }


}
