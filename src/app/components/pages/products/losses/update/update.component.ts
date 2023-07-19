import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ProductService } from 'src/app/services/product.service';

@Component({
  templateUrl: './update.component.html'
})
export class LossesUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listProducts: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<LossesUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiProduct: ProductService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      product_id: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.apiProduct.getProducts().subscribe((e: any) => {
      if (e.result) {
        this.listProducts = e.data;
      }
    });
    this.apiProduct.getLosseByID(this.data._id, true, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.updateForm.setValue({
          id: e.data.id,
          price: e.data.price,
          amount: e.data.amount,
          description: e.data.description,
          product_id: e.data.product_id,
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
      price: form.get('price')?.value,
      amount: form.get('amount')?.value,
      description: form.get('description')?.value,
      product_id: form.get('product_id')?.value,
      status: (form.get('status')?.value) ? '1' : '0',
    };

    this.apiProduct.updateLosses(data).subscribe(
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
