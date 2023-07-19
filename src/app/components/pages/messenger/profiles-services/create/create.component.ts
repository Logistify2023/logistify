import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { CustomerService } from 'src/app/services/customer.service';
import { MessengerService } from 'src/app/services/messenger.service';
import { GlobalConstants } from "../../../../../common/global-constants";

@Component({
  templateUrl: './create.component.html',
  styleUrls: []
})
export class ProfilesServicesCreateComponent {
  urlEndPoint: String = GlobalConstants.apiURL;

  createForm: FormGroup;
  errorMessages: string = '';
  submittedForm: boolean = false;
  fileRequired = false;
  idService: number;
  priceRequireFile = false;

  listTypePrices: any[] = [];
  listServices: any[] = [];

  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ProfilesServicesCreateComponent>,
    private formBuilder: FormBuilder,
    private apiMessenger: MessengerService,
    private apiCustomer: CustomerService,
    private utils: Utils,
    public dialog: MatDialog) {
    this.createForm = formBuilder.group({
      type_price_id: new FormControl('', [Validators.required]),
      profile: new FormControl('', [Validators.required]),
      services: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      percentaje: new FormControl('', []),
    });
  }

  ngOnInit(): void {
    this.apiMessenger.getTypePrices(0, false, false).subscribe((e: any) => {
      this.listTypePrices = e.data;
    });
    this.apiMessenger.getServices(0).subscribe((e: any) => {
      this.listServices = e.data;
    });
  }

  changeService(){
    let servicio = this.createForm.get('services')?.value;
    console.log(this.priceRequireFile)
    if(servicio.length == 1 && this.priceRequireFile){
      this.idService = servicio[0];
      this.fileRequired = true;
    }else{
      this.fileRequired = false;
    }
  }

  changeTypePrice() {
    this.apiMessenger.getTypePrices(this.createForm.get('type_price_id')?.value, false, false).subscribe((e: any) => {
      this.priceRequireFile = (e.data.is_file) ? true : false;
      this.changeService();
    });
  }
  filedata: any;
  onFileChange(event: any) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }
    reader.onload = () => {
      //this.previewImagePath = reader.result as string;
    };
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.filedata = file;
    }
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

    var formData: any = new FormData();
    form.get('services')?.value.forEach((i: any) => {
      formData.append("services[]", i);
    });
    if (this.fileRequired) {
      formData.append("coverage", this.filedata);
    } else {
      formData.append("percentaje", form.get('percentaje')?.value);
    }
    formData.append("type_price_id", form.get('type_price_id')?.value);
    formData.append("profile", form.get('profile')?.value);
    formData.append("description", form.get('description')?.value);
    this.apiMessenger.storeProfilesServices(formData).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Perfil de servicios', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.toastr.error(e.message, 'Perfil de servicios', {
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
