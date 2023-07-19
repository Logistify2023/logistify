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
export class ExpensesUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listSpending: any[] = [];
  listProducts: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ExpensesUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiProduct: ProductService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      discount: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      product_id: new FormControl('', [Validators.required]),
      spending_id: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.apiProduct.getProducts().subscribe((e: any) => {
      if (e.result) {
        this.listProducts = e.data;
      } else {
        this.toastr.error(e.message, 'Estado', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (error: any) => {
      let message = this.utils.getErrorMessage(error);
      this.errorMessages = message;
    });
    this.apiProduct.getSpendings().subscribe((e: any) => {
      if (e.result) {
        this.listSpending = e.data;
      } else {
        this.toastr.error(e.message, 'Estado', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (error: any) => {
      let message = this.utils.getErrorMessage(error);
      this.errorMessages = message;
    });
    this.apiProduct.getExpenseByID(this.data._id, true, true).subscribe((e: any) => {
      if (e.result) {
        this.updateForm.setValue({
          id: e.data.id,
          discount: e.data.discount,
          amount: e.data.amount,
          product_id: e.data.products ? e.data.products[0].id : 0,
          spending_id: e.data.spendings ? e.data.spendings[0].id : 0,
          status: e.data.status,
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
      discount: form.get('discount')?.value,
      amount: form.get('amount')?.value,
      product_id: form.get('product_id')?.value,
      spending_id: form.get('spending_id')?.value,
      status: (form.get('status')?.value) ? '1' : '0',
    };

    this.apiProduct.updateExpense(data).subscribe(
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
