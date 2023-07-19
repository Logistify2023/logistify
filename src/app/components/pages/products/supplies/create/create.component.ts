import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { ProductService } from 'src/app/services/product.service';

@Component({
  templateUrl: './create.component.html',
  styleUrls: []
})
export class SuppliesCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listProducts: any[] = [];
  listProviders: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<SuppliesCreateComponent>,
    private formBuilder: FormBuilder,
    private apiProduct: ProductService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      amount: new FormControl('', [Validators.required]),
      provider_id: new FormControl('', [Validators.required]),
      product_id: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.apiProduct.getProducts().subscribe((e: any) => {
      this.listProducts = e.data;
    });
    this.apiProduct.getProviders().subscribe((e: any) => {
      this.listProviders = e.data;
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
      amount: form.get('amount')?.value,
      provider_id: form.get('provider_id')?.value,
      product_id: form.get('product_id')?.value,
    };

    this.apiProduct.storeSupplie(data).subscribe(
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
