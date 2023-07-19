import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { MessengerService } from 'src/app/services/messenger.service';

@Component({
  templateUrl: './create.component.html',
  styleUrls: []
})
export class WebServicesCreateComponent {
  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;

  listCourier: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<WebServicesCreateComponent>,
    private formBuilder: FormBuilder,
    private apiMessenger: MessengerService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
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
      payload: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    this.apiMessenger.getCouriers(0, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 'courier').subscribe((e: any) => {
      this.listCourier = e.data;
    });
  }
  payloadParam(): FormArray { //FormArray
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
      payload: form.get('payload')?.value,
    };

    this.apiMessenger.storeWebServices(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Tipos de servicios', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Tipos de servicios', {
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
