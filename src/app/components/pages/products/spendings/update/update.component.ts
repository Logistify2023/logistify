import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { Utils } from 'src/app/common/utils';
import { ProductService } from 'src/app/services/product.service';

@Component({
  templateUrl: './update.component.html'
})
export class SpendingsUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listSpending: any[] = [];
  listProducts: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<SpendingsUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiProduct: ProductService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      spending: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.apiProduct.getSpendingByID(this.data._id, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.updateForm.setValue({
          id: e.data.id,
          spending: e.data.spending,
          price: e.data.price,
          description: e.data.description,
          status: (e.data.status == 'DISPONIBLE') ? true : false,
        });
      } else {
        this.toastr.error(e.message, 'Error', {
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

  onSubmit() {
    this.errorMessages = '';
    const form = this.updateForm;
    this.submittedForm = true;

    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }

    const data = {
      id: form.get('id')?.value,
      spending: form.get('spending')?.value,
      price: form.get('price')?.value,
      description: form.get('description')?.value,
      status: (form.get('status')?.value) ? '1' : '0',
    };

    this.apiProduct.updateSpending(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Actualización', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Actualización', {
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
