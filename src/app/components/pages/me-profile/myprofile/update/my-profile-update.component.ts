import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { MeProfileService } from 'src/app/services/meProfile.service';

@Component({
  selector: 'app-my-profile-update',
  templateUrl: './my-profile-update.component.html'
})

// Exportamos nuestro componente
export class MyProfileUpdateComponent implements OnInit {

  updateFormGroup: FormGroup;
  disableSelect = true;
  loading: boolean = false;

  listRoles: any[] = [];
  listStalls: any[] = [];
  listAreas: any[] = [];

  isEditable = false;
  errorMessages: string = '';
  submittedForm: boolean = false;
  previewImagePath: string = '';
  filedata: any;

  // Definimos los servicios a utilizar
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<MyProfileUpdateComponent>,
    private formBuilder: FormBuilder,
    private utils: Utils,
    public dialog: MatDialog,
    private meProfile: MeProfileService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10),]),
      status: new FormControl('', [Validators.nullValidator]),
      created_at: new FormControl('', [Validators.nullValidator]),
      updated_at: new FormControl('', [Validators.nullValidator]),
      // Data account
      description: new FormControl('', [Validators.nullValidator]),
      birth_date: new FormControl('', [Validators.nullValidator]),
      home_phone: new FormControl('', [Validators.nullValidator]),
      link: new FormControl('', [Validators.nullValidator]),
      website: new FormControl('', [Validators.nullValidator]),
      facebook: new FormControl('', [Validators.nullValidator]),
      youtube: new FormControl('', [Validators.nullValidator]),
      instagram: new FormControl('', [Validators.nullValidator]),
      twiter: new FormControl('', [Validators.nullValidator]),
      linkendin: new FormControl('', [Validators.nullValidator]),
      sex: new FormControl('', [Validators.required]),
      // Data relation
      stall: new FormControl('', [Validators.nullValidator]),
      account: new FormControl('', [Validators.nullValidator]),
      area: new FormControl('', [Validators.nullValidator]),
      role: new FormControl('', [Validators.nullValidator]),
      // Data relation Id's
      area_id: new FormControl('', [Validators.nullValidator]),
      stall_id: new FormControl('', [Validators.nullValidator]),
      role_id: new FormControl('', [Validators.nullValidator]),
      permissions: new FormControl([Validators.nullValidator]),
      clients: new FormControl('', [Validators.nullValidator]),
    });
  } 

  // Obtiene la información del usuario
  ngOnInit(): void {
    // Obtenemos el usuario
    this.loading = true;
    this.meProfile.getMeProfile().subscribe((e: any) => {
      this.loading = false;
      if (e.result) {        
        this.updateFormGroup.setValue({
          // Data user
          name: e.data.name,
          lastname: e.data.lastname,
          username: e.data.username,
          surname: e.data.surname,
          email: e.data.email,
          phone: e.data.phone,
          status: e.data.status,
          created_at: e.data.created_at,
          updated_at: e.data.updated_at,
          // Data aditional
          description: (e.data.account) ? e.data.account.description : '',
          birth_date: (e.data.account) ? e.data.account.birth_date : '',
          home_phone: (e.data.account) ? e.data.account.home_phone : '',
          link: (e.data.account) ? e.data.account.link : '',
          website: (e.data.account) ? e.data.account.website : '',
          facebook: (e.data.account) ? e.data.account.facebook : '',
          youtube: (e.data.account) ? e.data.account.youtube : '',
          instagram: (e.data.account) ? e.data.account.instagram : '',
          twiter: (e.data.account) ? e.data.account.twiter : '',
          linkendin: (e.data.account) ? e.data.account.linkendin : '',
          sex: (e.data.account) ? e.data.account.sex : '',
          // Data relation
          stall: (e.data.stall) ? e.data.stall.stall : '',
          area: (e.data.areas.length > 0) ? e.data.areas[0].area : '',
          role: (e.data.roles.length > 0) ? e.data.roles[0].rol : '',
          account: (e.data.account) ? e.data.account : '',
          // Data ids relation
          area_id: (e.data.areas.length > 0) ? e.data.areas[0].id : '',
          stall_id: (e.data.stall) ? e.data.stall.id : '',
          role_id: (e.data.roles.length > 0) ? e.data.roles[0].id : '',
          permissions: e.data.permissions,
          clients: e.data.customers,
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

  // Envia la información al servicio
  onSubmit() {
    this.errorMessages = '';
    this.submittedForm = true;
    this.loading = true;
    // Definimos la estructura a enviar
    const data = {
      name: this.updateFormGroup.get('name')?.value,
      lastname: this.updateFormGroup.get('lastname')?.value,
      surname: this.updateFormGroup.get('surname')?.value,
      username: this.updateFormGroup.get('username')?.value,
      email: this.updateFormGroup.get('email')?.value,
      phone: this.updateFormGroup.get('phone')?.value.toString(),
      description: this.updateFormGroup.get('description')?.value,
      birth_date: this.updateFormGroup.get('birth_date')?.value,
      home_phone: this.updateFormGroup.get('home_phone')?.value.toString(),
      link: this.updateFormGroup.get('link')?.value,
      website: this.updateFormGroup.get('website')?.value,
      facebook: this.updateFormGroup.get('facebook')?.value,
      youtube: this.updateFormGroup.get('youtube')?.value,
      instagram: this.updateFormGroup.get('instagram')?.value,
      twiter: this.updateFormGroup.get('twiter')?.value,
      linkendin: this.updateFormGroup.get('linkendin')?.value,
      sex: this.updateFormGroup.get('sex')?.value,
    };
    // Enviamos la información al servicio
    this.meProfile.updateMeProfile(data).subscribe(
      (e: any) => {
        this.submittedForm = false;
        this.loading = false;
        if (e.result) {
          if (localStorage.getItem('username')) {
            localStorage.setItem('username', data.username);
          }
          this.toastr.success(e.message, 'Perfil actualizado', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close(true);
        } else {
          this.toastr.error(e.message, 'Datos incorrectos', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error: any) => {
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      }
    );
  }
}
