import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ProductService } from 'src/app/services/product.service';

@Component({
  templateUrl: './restore.component.html'
})
export class SpendingsRestoreComponent implements OnInit {
  restoreForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<SpendingsRestoreComponent>,
    private formBuilder: FormBuilder,
    private apiProduct: ProductService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.restoreForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.restoreForm.setValue({
      id: this.data._id
    });
  }

  onSubmit() {
    this.errorMessages = '';
    if (this.restoreForm.invalid) {
      return;
    }

    this.apiProduct.restoreSpending(this.restoreForm.get('id')?.value).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Restaurar', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Restaurar', {
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
