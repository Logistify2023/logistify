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
export class ProductsCreateComponent {
  createForm: FormGroup;
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
    this.createForm.get('name')?.setValue(i.descripcion_producto);
    this.createForm.get('key')?.setValue(i.clv_producto);
    this.filteredOptions = of([]);
  }

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ProductsCreateComponent>,
    private formBuilder: FormBuilder,
    private apiProduct: ProductService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      key: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      existence: new FormControl('', [Validators.required]),
      long: new FormControl('', [Validators.required]),
      width: new FormControl('', [Validators.required]),
      high: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      is_intern: new FormControl('', []),
      category_id: new FormControl('', [Validators.required]),
      mark_id: new FormControl('', [Validators.required]),
      measure_unit_id: new FormControl('', [Validators.required]),
      locations: new FormControl('', [Validators.required]),
    });

    this.filteredOptions = this.createForm.controls['name'].valueChanges.pipe(
      startWith(''),
      debounceTime(500),
      distinctUntilChanged(),
      map(val => {
        return this.filter(val || '')
      })
    );
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
    let _locations: any[] = [];
    if (form.get('locations')?.value) {
      form.get('locations')?.value.forEach((i: any) => {
        _locations.push(i);
      });
    }
    const data = {
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
    };

    this.apiProduct.storeProduct(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Estado', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Estado', {
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
