import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ShipmentsService } from 'src/app/services/shipments.service';

@Component({
  selector: 'app-claims-delete',
  templateUrl: './delete.component.html'
})
export class ClaimsDeleteComponent implements OnInit {
  form: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  dataDeleted: boolean = false;

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ClaimsDeleteComponent>,
    private formBuilder: FormBuilder,
    private apiShipments: ShipmentsService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = formBuilder.group({
      id: new FormControl('', [Validators.required]),
    });
  }


  ngOnInit(): void {
    this.dataDeleted = this.data.dataDeleted;
    this.form.setValue({
      id: this.data._id
    });
  }

  onSubmit() {
    this.errorMessages = '';
    if (this.form.invalid) {
      return;
    }

    this.apiShipments.deleteClaims(this.form.get('id')?.value, this.dataDeleted).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Eliminar', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
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
