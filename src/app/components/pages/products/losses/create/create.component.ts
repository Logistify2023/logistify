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
export class LossesCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listProducts: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<LossesCreateComponent>,
    private formBuilder: FormBuilder,
    private apiProduct: ProductService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      price: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      product_id: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.apiProduct.getProducts().subscribe((e: any) => {
      if (e.result) {
        this.listProducts = e.data;
      }
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
      price: form.get('price')?.value,
      amount: form.get('amount')?.value,
      product_id: form.get('product_id')?.value,
      description: form.get('description')?.value,
    };

    this.apiProduct.storeLosses(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Ubicación', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Ubicación', {
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
