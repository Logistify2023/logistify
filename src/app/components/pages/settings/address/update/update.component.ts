import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Utils } from 'src/app/common/utils';
import { MeProfileService } from 'src/app/services/meProfile.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'update',
  templateUrl: './update.component.html'
})

// Exportamos nuestro componente
export class AddressUpdateComponent implements OnInit {

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

  // Definimos las variables para poder filtrar la información
  public state:             string = '';
  public listStates:        any = [];
  public municipality:      string = '';
  public listMunicips:      any = [];
  public settlement:        string = '';
  public listSettlems:      any = [];
  public settlement_type:   string = '';
  public listSettlemTypes:  any = [];
  public city:              string = '';
  public listCitys:         any = [];
  public zone:              string = '';
  public listZones:         any = [];
  public postal_code:       string = '';

  // Definimos los servicios a utilizar
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<AddressUpdateComponent>,
    private formBuilder: FormBuilder,
    private utils: Utils,
    public dialog: MatDialog,
    private apiAddress:   UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateFormGroup = this.formBuilder.group({
      state: new FormControl('', [Validators.required]),
      municipality: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.nullValidator]),
      settlement: new FormControl('', [Validators.required]),
      settlement_type: new FormControl('', [Validators.required]),
      zone: new FormControl('', [Validators.required]),
      postal_code: new FormControl('', [Validators.required]),
      d_cp: new FormControl('', [Validators.nullValidator]),
      c_state: new FormControl('', [Validators.nullValidator]),
      c_office: new FormControl('', [Validators.nullValidator]),
      c_cp: new FormControl('', [Validators.nullValidator]),
      c_settlement_type: new FormControl('', [Validators.nullValidator]),
      municipality_key: new FormControl('', [Validators.nullValidator]),
      id_asenta_cpcons: new FormControl('', [Validators.nullValidator]),
      c_cve_ciudad: new FormControl('', [Validators.nullValidator]),
      expiration_date: new FormControl('', [Validators.nullValidator]),
      status: new FormControl('', [Validators.required]),
    });
  } 

  // Obtiene la información del usuario
  ngOnInit(): void {
    // Obtenemos el usuario
    this.loading = true;
    // Get services for add address
    this.getStatesByService();
    this.getSettlementTypesByService();
    this.getZonasByService();
    // get address by id
    this.apiAddress.addressShow(this.data._id).subscribe((e: any) => {
      if (e.result) {
        // Set value to variables
        this.state            = e.data.state;
        this.municipality     = e.data.municipality;
        this.city             = e.data.city;
        this.settlement       = e.data.settlement;
        this.settlement_type  = e.data.settlement_type;
        this.zone             = e.data.zone;
        // Get services
        this.getMuncipalityByService();
        this.getCitysByService();
        this.getSettlementsByService();
        // Set values to form
        this.updateFormGroup.setValue({
          state: e.data.state,
          municipality: e.data.municipality,
          city: e.data.city,
          settlement: e.data.settlement,
          settlement_type: e.data.settlement_type,
          zone: e.data.zone,
          postal_code: e.data.postal_code,
          d_cp: e.data.d_cp,
          c_state: e.data.c_state,
          c_office: e.data.c_office,
          c_cp: e.data.c_cp,
          c_settlement_type: e.data.c_settlement_type,
          municipality_key: e.data.c_municipality,
          id_asenta_cpcons: e.data.id_asenta_cpcons,
          c_cve_ciudad: e.data.c_cve_ciudad,
          expiration_date: e.data.expiration_date,
          status: (e.data.status == 'DISPONIBLE') ? true : false,
        });
      } else {
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
      this.loading = false;
    }, (err: any) => {
      this.toastr.error(err.error.message, 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }

  // Se encarga de obtener los estados
  getStatesByService() {
    this.apiAddress.getStates().subscribe((e: any) => {
      if (e.result) {
        this.listStates = e.data;
      }else{
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error("No se logro obtener los estados correctamente", 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    })
  }

  // Se encarga de traer la data para los select de municipios y ciudades
  changeMunicipalityAndCityes() {
    this.getMuncipalityByService();
    this.getCitysByService();
  }
  
  // Se encarga de obtener los municipios de un estado
  getMuncipalityByService() {
    // this.municipality = '';
    // this.settlement = '';
    this.apiAddress.getMunicipalities(this.state).subscribe((e: any) => {
      if (e.result) {
        this.listMunicips = e.data;
      }else{
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error("No se logro obtener los municipios correctamente", 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    })
  }

  // Se encarga de obtener las ciudades de un estado del servicio
  getCitysByService() {
    // this.city = '';
    this.apiAddress.getCities(this.state).subscribe((e: any) => {
      if (e.result) {
        this.listCitys = e.data;
      }else{
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error("No se logro obtener las ciudades correctamente", 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    })
  }

  // Se encarga de obtener los asentamientos de un estado y municipio del servicio
  getSettlementsByService() {
    // this.settlement = '';
    this.apiAddress.getSettlements(this.state, this.municipality).subscribe((e: any) => {
      if (e.result) {
        this.listSettlems = e.data;
      }else{
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error("No se logro obtener las colonias correctamente", 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }

  // Se encarga de obtener los tipos de asentamientos que existen
  getSettlementTypesByService() {
    this.settlement_type = '';
    this.apiAddress.getSettlementsTypes().subscribe((e: any) => {
      if (e.result) {
        this.listSettlemTypes = e.data;
      }else{
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error("No se logro obtener las tipos de colonias correctamente", 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }

  // Se encarga de obtener los diferentes tipos de zonas
  getZonasByService() {
    this.zone = '';
    this.apiAddress.getZones().subscribe((e: any) => {
      if (e.result) {
        this.listZones = e.data;
      }else{
        this.toastr.warning(e.message, 'Advertencia', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.toastr.error("No se logro obtener las zonas correctamente", 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }

  // Envia la información al servicio
  onSubmit() {
    if(!parseInt(this.updateFormGroup.get('postal_code')?.value!)) {
      this.toastr.warning("EL código postal tiene que ser un número", 'Advertencia', {
        timeOut: 3000,
        enableHtml: true
      });
      this.updateFormGroup.get('postal_code')?.setValue(null);
      return;
    }
    this.errorMessages  = '';
    this.submittedForm  = true;
    this.loading        = true;
    // Definimos la estructura a enviar
    const request = {
      state: this.updateFormGroup.get('state')?.value,
      municipality: this.updateFormGroup.get('municipality')?.value,
      city: this.updateFormGroup.get('city')?.value,
      settlement: this.updateFormGroup.get('settlement')?.value,
      settlement_type: this.updateFormGroup.get('settlement_type')?.value,
      zone: this.updateFormGroup.get('zone')?.value,
      postal_code: this.updateFormGroup.get('postal_code')?.value,
      d_cp: this.updateFormGroup.get('d_cp')?.value,
      c_state: this.updateFormGroup.get('c_state')?.value,
      c_office: this.updateFormGroup.get('c_office')?.value,
      c_cp: this.updateFormGroup.get('c_cp')?.value,
      c_settlement_type: this.updateFormGroup.get('c_settlement_type')?.value,
      municipality_key: this.updateFormGroup.get('municipality_key')?.value,
      id_asenta_cpcons: this.updateFormGroup.get('id_asenta_cpcons')?.value,
      c_cve_ciudad: this.updateFormGroup.get('c_cve_ciudad')?.value,
      expiration_date: this.updateFormGroup.get('expiration_date')?.value,
      status: (this.updateFormGroup.get('status')?.value) ? '1' : '0',
    };
    // Enviamos la información al servicio
    this.apiAddress.addressUpdate(this.data._id, request).subscribe(
      (e: any) => {
        this.submittedForm  = false;
        this.loading        = false;
        if (e.result) {
          this.toastr.success(e.message, 'Dirección actualizada', {
            timeOut: 3000,
            enableHtml: true,
          });
          this.dialogRef.close(true);
        } else {
          this.toastr.error(e.message, 'Datos incorrectos', {
            timeOut: 3000,
            enableHtml: true,
          });
        }
      },
      (error: any) => {
        this.loading        = false;
        this.submittedForm  = false;
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
      }
    );
  }
}