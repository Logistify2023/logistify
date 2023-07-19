import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { MessengerService } from 'src/app/services/messenger.service';

@Component({
  templateUrl: './create.component.html',
  styleUrls: []
})
export class ServicesCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listCourierTypes: any[] = [];
  listCourier: any[] = [];
  listServiceType: any[] = [];
  listDeliveryDays: any[] = [];;

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ServicesCreateComponent>,
    private formBuilder: FormBuilder,
    private apiMessenger: MessengerService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      service: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.nullValidator]),
      delivery_day: new FormControl('', [Validators.required]),
      guaranteed_delivery: new FormControl('', [Validators.nullValidator]),
      multi_piece: new FormControl('', [Validators.nullValidator]),
      international: new FormControl('', [Validators.nullValidator]),
      fuel: new FormControl('', [Validators.required]),
      pickup: new FormControl('', [Validators.nullValidator]),
      is_ltl: new FormControl('', [Validators.nullValidator]),
      courier_type_id: new FormControl('', [Validators.required]),
      service_type_id: new FormControl('', [Validators.required]),
      courier_id: new FormControl('', [Validators.required]),
      delivery_days_id: new FormControl('', [Validators.required]),
      max_long: new FormControl('', [Validators.required]),
      max_width: new FormControl('', [Validators.required]),
      max_high: new FormControl('', [Validators.required]),
      max_weight: new FormControl('', [Validators.required]),
      volumetric_divider: new FormControl('', [Validators.required]),
      max_kilogram: new FormControl('', [Validators.required]),
      number_of_groups_origen: new FormControl('', [Validators.required]),
      number_of_groups_destine: new FormControl('', [Validators.required]),
      number_of_detines: new FormControl('', [Validators.required]),
      number_of_zones: new FormControl('', [Validators.required]),
      number_of_kilograms: new FormControl('', [Validators.required]),
      payload: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.apiMessenger.getCouriers(0, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 'courier').subscribe((e: any) => {
      this.listCourier = e.data;
    });
    this.apiMessenger.getServiceTypes(0, false, false, 'service_type').subscribe((e: any) => {
      this.listServiceType = e.data;
    });
    this.apiMessenger.getDeliveryDays(0, false, false, 'id').subscribe((e: any) => {
      this.listDeliveryDays = e.data;
    });
  }

  payloadParam(): FormArray {
    return this.createForm.get("payload") as FormArray
  }

  newPayloadParam(): FormGroup {
    return this.formBuilder.group({
      name: '',
      value: '',
    })
  }

  addPayloadParam() {
    this.payloadParam().push(this.newPayloadParam());
  }
  
  removePayloadParam(i: number) {
    this.payloadParam().removeAt(i);
  }
  
  changeCourier() {
    let id = this.createForm.get('courier_id')?.value;
    this.apiMessenger.getCouriers(id, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, 'courier_type').subscribe((e: any) => {
      this.listCourierTypes = e.data.courier_types;
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
    // agregar los valores request al array de payload
    let _payload: any[] = [];
    this.payloadParam().value.forEach((i: any) => {
      _payload.push(i);
    }); 

    // convertir el array de payload de objetos a un objeto para guardarlo
    var payload_obj: any = new Object();
    _payload.forEach(function(val){
      let name;
      name = val.name;
      payload_obj[name] = val.value;
    });

    let delivery_days_ids: any[] = [];
    form.get('delivery_days_id')?.value.forEach((i: any) => {
      delivery_days_ids.push(i);
    });
    const data = {
      service: form.get('service')?.value,
      description: form.get('description')?.value,
      delivery_day: form.get('delivery_day')?.value,
      guaranteed_delivery: (form.get('guaranteed_delivery')?.value) ? true : false,
      multi_piece: (form.get('multi_piece')?.value) ? true : false,
      international: (form.get('international')?.value) ? true : false,
      fuel: form.get('fuel')?.value,
      pickup: (form.get('pickup')?.value) ? true : false,
      is_ltl: (form.get('is_ltl')?.value) ? true : false,
      courier_type_id: form.get('courier_type_id')?.value,
      service_type_id: form.get('service_type_id')?.value,
      courier_id: form.get('courier_id')?.value,
      delivery_days_id: delivery_days_ids,
      max_long: form.get('max_long')?.value,
      max_width: form.get('max_width')?.value,
      max_high: form.get('max_high')?.value,
      max_weight: form.get('max_weight')?.value,
      volumetric_divider: form.get('volumetric_divider')?.value,
      max_kilogram: form.get('max_kilogram')?.value,
      number_of_groups_origen: form.get('number_of_groups_origen')?.value,
      number_of_groups_destine: form.get('number_of_groups_destine')?.value,
      number_of_detines: form.get('number_of_detines')?.value,
      number_of_zones: form.get('number_of_zones')?.value,
      number_of_kilograms: form.get('number_of_kilograms')?.value,
      payload: payload_obj,
    };
    this.apiMessenger.storeServices(data).subscribe(
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