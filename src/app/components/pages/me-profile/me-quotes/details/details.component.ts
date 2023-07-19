import { DataTableConstants } from './../../../../../common/datatables-constants';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants } from 'src/app/common/global-constants';
import { MeProfileService } from 'src/app/services/meProfile.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-receivers-details',
  templateUrl: './details.component.html'
})

// Exportamos nuestro componente
export class MeQuoteDetailsComponent implements OnInit {

  // Asignamos y declaramos las varianles a utilizar en este componente
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public urlEndPoint      = GlobalConstants.apiURL;
  public loading          : boolean   = true;
  public disabledBtnPdf   : boolean   = false;
  public disabledBtnGuide : boolean   = false;
  public dataToShip       : any;
  public objectDetails    : any       = {};
  public displayedColumns_Payload : string[] = ['type', 'long', 'width', 'high', 'weight', 'quantity', 'campaign', 'cost_center', 'content'];
  public columsChargesAdd         : string[] = ['service', 'price', 'by_search'];
  public columsServicesAdd        : string[] = ['service', 'price', 'by_search'];

  // Definimos los servicios que utilizaremos en este componente
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<MeQuoteDetailsComponent>,
    private api_MeQuote: MeProfileService,
    public dialog: MatDialog,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  // Cargamos la información de la cotización
  ngOnInit(): void {
    this.loading = true;
    this.api_MeQuote.showMeQuote(this.data._id, true, true, true, true).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        // Validamos que este disponble y que no tenga calle
        if(e.data.status == "NO DISPONIBLE") this.disabledBtnGuide = true;
        if(typeof e.data.origin.street == 'undefined') this.disabledBtnGuide = true;
        if(typeof e.data.destin.street == 'undefined') this.disabledBtnGuide = true;
        // Asignamos la data a la variable
        this.objectDetails = e.data;
      } else {
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error(err.error.message, 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }

  // Se encarga de descargar el PDF de una guía
  downloadQuotePdf(id: any, filename: string = "cotizaciónPdf.pdf") {
    this.disabledBtnPdf = true;
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    this.http.get(this.urlEndPoint + '/quote/export-pdf/' + id, {headers, responseType: 'blob' as 'json'}).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        this.disabledBtnPdf = false;
      }
    )
  }

  // Se encarga de generar una guía con la paquetera correspondiente
  generateGuideByQuote(quote: any) {
    this.disabledBtnGuide = true;
    // Armamos el objeto de un envío
    this.dataToShip = {
      id_quote: quote.id,
      id_customer: quote.customer_id,
      origin: {
        postal_code: quote.origin.postal_code,
        state: quote.origin.state,
        city: quote.origin.city,
        municipality: quote.origin.municipality,
        settlement: quote.origin.settlement,
        street: quote.origin.street,
        suburb: quote.origin.suburb,
        location: quote.origin.location,
        reference: quote.origin.reference,
        outdoor_number: quote.origin.outdoor_number,
        interior_number: quote.origin.interior_number,
        branch_office: quote.origin.branch_office,
        business: quote.origin.business,
        contact: quote.origin.contact,
        stall: quote.origin.stall,
        rfc: quote.origin.rfc,
        phone: quote.origin.phone,
        email: quote.origin.email,
      },
      destin: {
        postal_code: quote.destin.postal_code,
        state: quote.destin.state,
        city: quote.destin.city,
        municipality: quote.destin.municipality,
        settlement: quote.destin.settlement,
        street: quote.destin.street,
        suburb: quote.destin.suburb,
        location: quote.destin.location,
        reference: quote.destin.reference,
        outdoor_number: quote.destin.outdoor_number,
        interior_number: quote.destin.interior_number,
        branch_office: quote.destin.branch_office,
        business: quote.destin.business,
        contact: quote.destin.contact,
        stall: quote.destin.stall,
        rfc: quote.destin.rfc,
        phone: quote.destin.phone,
        email: quote.destin.email,
      },
      packages: quote.packages,
      services: quote.services,
      additionals: quote.charges,
    };
    // ENviamos la data al servicio
    this.api_MeQuote.storeMeShipment(this.dataToShip).subscribe(
      (e: any) => {
        this.disabledBtnGuide = false;
        if (e.result) {
          this.toastr.success(e.message, 'Envio generado', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close(true);
        } else {
          this.toastr.error(e.message, 'Error', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        this.disabledBtnGuide = false;
        this.toastr.error(error.message, 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    );
  }
}
