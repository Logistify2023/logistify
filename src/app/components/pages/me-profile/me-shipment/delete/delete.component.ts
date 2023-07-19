import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { MeProfileService } from 'src/app/services/meProfile.service';

@Component({
  selector: 'app-receivers-delete',
  templateUrl: './delete.component.html'
})

// Exportamos el componente
export class MeShipmentDeleteComponent implements OnInit {
  deleteForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  // Definimos los servicios que haremos uso
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<MeShipmentDeleteComponent>,
    private formBuilder: FormBuilder,
    private api_MeShipment: MeProfileService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.deleteForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
    });
  }

  // Asignamos el id al formulario
  ngOnInit(): void {
    this.deleteForm.setValue({
      id: this.data._id
    });
  }

  // Procesamos la petición para eliminar el envío
  onSubmit() {
    this.errorMessages = '';
    if (this.deleteForm.invalid) {
      return;
    }
    this.submittedForm = true;
    // Enviamos la peticion
    this.api_MeShipment.deleteMeShipment(this.deleteForm.get('id')?.value).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Eliminar', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close(true);
        } else {
          this.toastr.warning(e.message, 'Eliminar', {
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
