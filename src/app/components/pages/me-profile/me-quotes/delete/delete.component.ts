import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { MeProfileService } from 'src/app/services/meProfile.service';

@Component({
  selector: 'app-receivers-delete',
  templateUrl: './delete.component.html'
})

// Exportamos el componente
export class MeQuoteDeleteComponent implements OnInit {

  public deleteForm     : FormGroup;
  public errorMessages  : string = '';
  public disableBtnDel  : boolean = false;

  // Definimos los servicio que utiolizamos
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<MeQuoteDeleteComponent>,
    private formBuilder: FormBuilder,
    private api_MeQuote: MeProfileService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.deleteForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
    });
  }

  // Asignamos el id en el formulario
  ngOnInit(): void {
    this.deleteForm.setValue({
      id: this.data._id
    });
  }

  // Procesamos la petición
  onSubmit() {
    this.errorMessages = '';
    if (this.deleteForm.invalid) {
      return;
    }
    this.disableBtnDel = true;
    // Procesamos el servicio para eliminar
    this.api_MeQuote.deleteMeQuote(this.deleteForm.get('id')?.value).subscribe(
      (e: any) => {
        this.disableBtnDel = false;
        if (e.result) {
          this.toastr.success(e.message, 'Eliminada', {
            timeOut: 3000,
            enableHtml: true
          });
          // Cerramos el modal
          this.dialogRef.close(true);
        } else {
          this.toastr.error(e.message, 'Error', {
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
