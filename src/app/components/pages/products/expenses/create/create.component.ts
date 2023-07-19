import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, map, Observable, of, startWith } from 'rxjs';
import { Utils } from 'src/app/common/utils';
import { ProductService } from 'src/app/services/product.service';

@Component({
  templateUrl: './create.component.html',
  styleUrls: []
})
export class ExpensesCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listSpending: any[] = [];
  listProducts: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ExpensesCreateComponent>,
    private formBuilder: FormBuilder,
    private apiProduct: ProductService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      discount: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      product_id: new FormControl('', [Validators.required]),
      spending_id: new FormControl('', [Validators.required]),
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
  }

  onSubmit() {
    this.errorMessages = '';
    this.submittedForm = true;
    const form = this.createForm;

    if (form.invalid) {
      console.log(form);
      this.errorMessages = 'Verifica los datos.';
      return;
    }

    const data = {
      discount: form.get('discount')?.value,
      amount: form.get('amount')?.value,
      product_id: form.get('product_id')?.value,
      spending_id: form.get('spending_id')?.value,
    };

    this.apiProduct.storeExpense(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Gastos', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Gastos', {
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
