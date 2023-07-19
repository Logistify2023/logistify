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
export class ProductsUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listProductsServices: any[] = [];
  listCategories: any[] = [];
  listMeasureUnits: any[] = [];
  listProductsType: any[] = [];
  listBrands: any[] = [];
  listLocations: any[] = [];

  filteredOptions: Observable<any[]>;
  filteredOptionsUp: Observable<any[]>;

  filter(val: string): any[] {
    return this.listProductsServices.filter((s: any) => {
      if (val.length >= 3) {
        return s.descripcion_producto.toLowerCase().includes(val.toLowerCase());
      }
    });
  }
  selectedProductCreate(i: any) {
    this.updateForm.get('name')?.setValue(i.descripcion_producto);
    this.updateForm.get('key')?.setValue(i.clv_producto);
    this.filteredOptions = of([]);
  }
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ProductsUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiProduct: ProductService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      existence: new FormControl('', [Validators.required]),
      long: new FormControl('', [Validators.required]),
      width: new FormControl('', [Validators.required]),
      high: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      is_intern: new FormControl('', [Validators.required]),
      category_id: new FormControl('', [Validators.required]),
      mark_id: new FormControl('', [Validators.required]),
      measure_unit_id: new FormControl('', [Validators.required]),
      locations: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.apiProduct.getProducsAndServices().subscribe((e: any) => {
      this.listProductsServices = e.data;
    });
    this.apiProduct.getCategories().subscribe((e: any) => {
      this.listCategories = e.data;
    });
    this.apiProduct.getMeasureUnits().subscribe((e: any) => {
      this.listMeasureUnits = e.data;
    });
    this.apiProduct.getMarks().subscribe((e: any) => {
      this.listBrands = e.data;
    });
    this.apiProduct.getLocations().subscribe((e: any) => {
      this.listLocations = e.data;
    });
    this.apiProduct.getProductByID(this.data._id, false, false, false, false, false, false, false, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.updateForm.setValue({
          id: e.data.id,
          key: e.data.key,
          name: e.data.name,
          description: e.data.description,
          existence: e.data.existence,
          long: e.data.long,
          width: e.data.width,
          high: e.data.high,
          weight: e.data.weight,
          type: e.data.type,
          is_intern: (e.data.is_intern == "INTERN") ? true : false,
          category_id: e.data.category_id,
          mark_id: e.data.mark_id,
          measure_unit_id: e.data.measure_unit_id,
          locations: e.data.locations,
          status: e.data.status == 'DISPONIBLE' ? true : false,
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
    let _locations: any[] = [];
    if (form.get('locations')?.value) {
      form.get('locations')?.value.forEach((i: any) => {
        _locations.push(i);
      });
    }

    const data = {
      id: form.get('id')?.value,
      key: form.get('key')?.value,
      name: form.get('name')?.value,
      description: form.get('description')?.value,
      existence: form.get('existence')?.value,
      long: form.get('long')?.value,
      width: form.get('width')?.value,
      high: form.get('high')?.value,
      weight: form.get('weight')?.value,
      type: form.get('type')?.value,
      is_intern: (form.get('is_intern')?.value == '1') ? 'INTERN' : 'EXTERN',
      category_id: form.get('category_id')?.value,
      mark_id: form.get('mark_id')?.value,
      measure_unit_id: form.get('measure_unit_id')?.value,
      locations: _locations,
      status: (form.get('status')?.value) ? '1' : '0',
    };

    this.apiProduct.updateProduct(data).subscribe(
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
