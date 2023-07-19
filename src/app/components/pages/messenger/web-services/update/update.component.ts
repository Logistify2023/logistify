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
export class WebServicesUpdateComponent implements OnInit {
  updateForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listCourier: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<WebServicesUpdateComponent>,
    private formBuilder: FormBuilder,
    private apiMessenger: MessengerService,
    private apiUtils: UtilsService,
    private utils: Utils,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.updateForm = formBuilder.group({
      id: new FormControl('', [Validators.required]),
      web_service: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      service: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      host: new FormControl('', [Validators.required]),
      port: new FormControl('', [Validators.required]),
      user: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      license: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      courier_id: new FormControl('', [Validators.required]),
      status: new FormControl('', [Validators.required]),
      payload: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.apiMessenger.getCouriers(0, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 'courier').subscribe((e: any) => {
      this.listCourier = e.data;
    });
    this.apiMessenger.getWebServices(this.data._id, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        while (this.payloadParam().length !== 0) {
          this.payloadParam().removeAt(0)
        }

        let _payload = this.updateForm.get("payload") as FormArray;
        if (e.data.payload) {
          e.data.payload.forEach((i: any) => {
            _payload.push(this.formBuilder.group({
              name: i.name,
              value: i.value,
            }));
          });
        }
        this.updateForm.setValue({
          id: e.data.id,
          web_service: e.data.web_service,
          description: e.data.description,
          service: e.data.service,
          date: e.data.date,
          host: e.data.host,
          port: e.data.port,
          user: e.data.user,
          password: e.data.password,
          license: e.data.license,
          url: e.data.url,
          courier_id: (e.data.couriers) ? e.data.couriers[0].id : 0,
          payload: _payload.value,
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
      web_service: form.get('web_service')?.value,
      description: form.get('description')?.value,
      service: form.get('service')?.value,
      date: form.get('date')?.value,
      host: form.get('host')?.value,
      port: form.get('port')?.value,
      user: form.get('user')?.value,
      password: form.get('password')?.value,
      license: form.get('license')?.value,
      url: form.get('url')?.value,
      courier_id: form.get('courier_id')?.value,
      status: (form.get('status')?.value) ? '1' : '0',
      payload: form.get('payload')?.value,
    };

    this.apiMessenger.updateWebServices(data).subscribe(
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
