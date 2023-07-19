import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { MeProfileService } from 'src/app/services/meProfile.service';

@Component({
  selector: 'app-cancel-shipment',
  templateUrl: './cancel.component.html'
})

// Exportamos este componente
export class MeShipmentCancelComponent implements OnInit {

  // Definimos las variables a utilizar
  cancelForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  dataDeleted: boolean = false;

  // DEfinimos los servicios que haremos uso
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<MeShipmentCancelComponent>,
    private formBuilder: FormBuilder,
    private apiShipments: ShipmentsService,
    private api_MeShipments: MeProfileService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.cancelForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
    });
  }

  // Asignamos el id en el formulario
  ngOnInit(): void {
    this.cancelForm.setValue({
      id: this.data._id
    });
  }

  // Validamos a que envío vamos a cancelar
  onSubmit() {
    this.errorMessages = '';
    if (this.cancelForm.invalid) {
      return;
    }
    this.submittedForm = true;
    // Enviamos la data
    this.api_MeShipments.cancelMeShipment(this.cancelForm.get('id')?.value).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Cancelado', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close(true);
        } else {
          this.toastr.warning(e.message, 'Cancelado', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      }
    );
  }
}
