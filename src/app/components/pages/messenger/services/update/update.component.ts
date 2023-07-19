import { ThisReceiver } from '@angular/compiler';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { MessengerService } from 'src/app/services/messenger.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  templateUrl: './update.component.html'
})
export class ServicesUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listCourierTypes: any[] = [];
  listCourier: any[] = [];
  listServiceType: any[] = [];
  listDeliveryDays: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ServicesUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiMessenger: MessengerService,
    private apiUtils: UtilsService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
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
      setting_id: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
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

    this.apiMessenger.getServices(this.data._id, false, false, false, false, true, true, false, false, true, false, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        let days: any[] = [];
        e.data.delivery_days.forEach((i: any)=>{
          days.push(i.id);
        })
        console.log(e.data)
        // convertir el objeto del payolad a un array para settear los valores
        let payload_set_array: any[] = [];
        if(e.data.payload){
          const arrayList = Object.entries(e.data.payload).map(([key, val]) => {
            return { name: key, value: val};
          });
          payload_set_array = arrayList;
        }
        
        // setear los valores del array del payload
        let payload_val: any[] = [];
        if( e.data.payload != null){
          const payload_array = this.payloadParam();
          payload_set_array.forEach((i: any) =>{
              payload_array.push(this.newPayloadParam());
              payload_val.push(i)
          }); 
          console.log(payload_array) 
        }
        
        this.updateForm.setValue({
          id: e.data.id,
          service: e.data.service,
          description: e.data.description,
          delivery_day: e.data.delivery_day,
          guaranteed_delivery: e.data.guaranteed_delivery,
          multi_piece: e.data.multi_piece,
          international: e.data.international,
          fuel: e.data.fuel,
          pickup: e.data.pickup,
          is_ltl: e.data.is_ltl,
          courier_type_id: e.data.courier_type_id,
          service_type_id: e.data.service_type_id,
          courier_id: e.data.courier_id,
          delivery_days_id: days,
          max_long: e.data.setting.max_long,
          max_width: e.data.setting.max_width,
          max_high: e.data.setting.max_high,
          max_weight: e.data.setting.max_weight,
          volumetric_divider: e.data.setting.volumetric_divider,
          max_kilogram: e.data.setting.max_kilogram,
          number_of_groups_origen: e.data.setting.number_of_groups_origen,
          number_of_groups_destine: e.data.setting.number_of_groups_destine,
          number_of_detines: e.data.setting.number_of_detines,
          number_of_zones: e.data.setting.number_of_zones,
          number_of_kilograms: e.data.setting.number_of_kilograms,
          setting_id: e.data.setting_id,
          payload: payload_val,
          status: (e.data.status == 'DISPONIBLE') ? true : false,
          // setting_id
        });
        this.changeCourier();
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

  payloadParam(): FormArray { //FormArray
    return this.updateForm.get("payload") as FormArray
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
    let id = this.updateForm.get('courier_id')?.value;
    this.apiMessenger.getCouriers(id, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, false, false, false, false, false, 'courier_type').subscribe((e: any) => {
      this.listCourierTypes = e.data.courier_types;
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
    // agregar los valores al array
    let _payload: any[] = [];
    this.payloadParam().value.forEach((i: any) => {
      _payload.push(i);
    }); 
    
    // convertir el array a un objeto para guardarlo
    var payload_obj: any = new Object();
    _payload.forEach(function(val){
      let name;
      name = val.name;
      payload_obj[name] = val.value;
    })
    // agtregar los dias ae entrega al array
    let delivery_days_ids: any[] = [];
    form.get('delivery_days_id')?.value.forEach((i: any) => {
      delivery_days_ids.push(i);
    });
    const data = {
      id: form.get('id')?.value,
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
      setting_id: form.get('setting_id')?.value,
      status: (form.get('status')?.value) ? '1' : '0',
      payload: payload_obj,
    };

    this.apiMessenger.updateServices(data).subscribe(
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
