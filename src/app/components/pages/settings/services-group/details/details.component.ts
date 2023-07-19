import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MessengerService } from 'src/app/services/messenger.service';
import { GlobalConstants } from "../../../../../common/global-constants";

@Component({
  templateUrl: './details.component.html'
})

// Exportamos nuestro compoenente
export class GroupDetailsComponent implements OnInit {

  // Definimos las variables a utilizar
  public loanding: boolean = false;
  public urlEndPoint: String = GlobalConstants.apiURL;
  public objectDetails: any = {};

  // Definimos los servicios a utilizar en nuestro componente
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<GroupDetailsComponent>,
    private apiMessenger: MessengerService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  // Cargamos el compoenente con la información
  ngOnInit(): void {
    this.loanding = true;
    this.apiMessenger.getServices(this.data._id, false, false, false, false, true, true, true, true, true, false, false, false, false, false, false, false, false, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.loanding = false;
        this.objectDetails = e.data;
        let delivery_days: string = '';
        this.objectDetails.delivery_days.forEach((i: any) => {
            delivery_days += i.day + ', ';
        });
        this.objectDetails.guaranteed_delivery  = (this.objectDetails.guaranteed_delivery) ? 'Si' : 'No';
        this.objectDetails.multi_piece          = (this.objectDetails.multi_piece) ? 'Si' : 'No';
        this.objectDetails.international        = (this.objectDetails.international) ? 'Si' : 'No';
        this.objectDetails.pickup               = (this.objectDetails.pickup) ? 'Si' : 'No';
        this.objectDetails.is_ltl               = (this.objectDetails.is_ltl) ? 'Si' : 'No';
        this.objectDetails.courier_type_stg     = (this.objectDetails.courier_type) ? this.objectDetails.courier_type.courier_type : 'N/A';
        this.objectDetails.service_type_stg     = (this.objectDetails.service_type) ? this.objectDetails.service_type.service_type : 'N/A';
        this.objectDetails.courier_stg          = (this.objectDetails.courier) ? this.objectDetails.courier.courier : 'N/A';
        this.objectDetails.days                 = delivery_days;
      } else {
        this.loanding = false;
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.warning(err.error.message, 'Advertencia', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }
}