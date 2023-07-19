import { TrackingService } from './../../../../../services/tracking.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';

@Component({
  selector: 'app-tracking-shipment',
  templateUrl: './tracking.component.html'
})

// Exportamos este componente
export class TrackingComponent implements OnInit {

  // Definimos las variables a utilizar
  updatedForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  // Definimos los servicios que haremos uso
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<TrackingComponent>,
    private formBuilder: FormBuilder,
    private apiTracking: TrackingService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.updatedForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
    });
  }

// Asignamos el id en el formulario
ngOnInit(): void {
  this.updatedForm.setValue({
    id: this.data._id
  });
}

  // Validamos a cuando vayamos a actualizar los rastres
  onSubmit() {
    this.errorMessages = '';
    if (this.updatedForm.invalid) {
      return;
    }
    this.submittedForm = true;
    // Enviamos la data
    this.apiTracking.storeTracking().subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          let mensaje = "Se actualizan los rastreos de acuerdo a: " + JSON.stringify(e.data);
          this.toastr.success(mensaje, 'Actualizado', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close(true);
        } else {
          this.toastr.warning(e.message, 'Advertencia', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        this.submittedForm = false;
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      }
    );
  }
}
