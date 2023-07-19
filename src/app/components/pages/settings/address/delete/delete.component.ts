import { UtilsService } from 'src/app/services/utils.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { Utils } from 'src/app/common/utils';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: []
})

// Exportamos el componente
export class AddressDeleteComponent implements OnInit {

  deleteForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  // Definimos los servicios a utilizar en este componente
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddressDeleteComponent>,
    private formBuilder: FormBuilder,
    private apiAddress: UtilsService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.deleteForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
    });
  }

  // Cargamos la data
  ngOnInit(): void {
    this.deleteForm.setValue({
      id: this.data._id
    });
  }

  // Procesa la eliminación de la cotización masiva
  onSubmit() {
    this.errorMessages = '';
    if (this.deleteForm.invalid) {
      return;
    }
    this.submittedForm = true;
    this.apiAddress.addressDelete(this.deleteForm.get('id')?.value).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Eliminada', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close(true);
        } else {
          this.toastr.error(e.message, 'Eliminar', {
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