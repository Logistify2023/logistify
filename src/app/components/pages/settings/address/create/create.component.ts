import { UtilsService } from 'src/app/services/utils.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Utils } from 'src/app/common/utils';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: []
})

// Exportamos el componente
export class AddressCreateComponent implements OnInit {

  // Definimos las variables a utilizar
  urlEndPoint:        string      = GlobalConstants.apiURL;
  errorMessages:      string      =  '';
  uploadFile:         boolean     = false;
  submittedForm:      boolean     = false;
  loading:            boolean     = false;
  listCustomers:      any[]       = [];
  listServicesClient: any[]       = [];
  customer_id:        number;
  num_packages:       number      = 0;
  num_envelopes:      number      = 0;
  multipieza:         number      = 0;
  disabledBtnExcel:   boolean     = false;
  downloadTemplate:   boolean     = false;

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

  // Almacena la información del archivo a importar
  public fileData:        any;

  formAddress = this.formBuilder.group({
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
  });

  // Definimos los servicios que haremos uso
  constructor(
    private formBuilder:  FormBuilder,
    public dialogRef:     MatDialogRef<AddressCreateComponent>,
    private utils:        Utils,
    private toastr:       ToastrService,
    private http:         HttpClient,
    private apiAddress:   UtilsService,
  ) { }

  // Cargamos la informacion del cliente
  ngOnInit(): void {
    // Get services for add addres
    this.getStatesByService();
    this.getSettlementTypesByService();
    this.getZonasByService();
  }

  // Se encarga de obtener los estados
  getStatesByService() {
    this.apiAddress.getStates().subscribe((e: any) => {
      if (e.result) {
        // Asignamos los estados al arreglo
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
    this.municipality = '';
    this.settlement = '';
    this.apiAddress.getMunicipalities(this.state).subscribe((e: any) => {
      if (e.result) {
        // Asignamos los estados al arreglo
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
    this.city = '';
    this.apiAddress.getCities(this.state).subscribe((e: any) => {
      if (e.result) {
        // Asignamos los estados al arreglo
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
    this.settlement = '';
    this.apiAddress.getSettlements(this.state, this.municipality).subscribe((e: any) => {
      if (e.result) {
        // Asignamos los estados al arreglo
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
    })
  }

  // Se encarga de obtener los tipos de asentamientos que existen
  getSettlementTypesByService() {
    this.settlement_type = '';
    this.apiAddress.getSettlementsTypes().subscribe((e: any) => {
      if (e.result) {
        // Asignamos los estados al arreglo
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
    })
  }

  // Se encarga de obtener los diferentes tipos de zonas
  getZonasByService() {
    this.zone = '';
    this.apiAddress.getZones().subscribe((e: any) => {
      if (e.result) {
        // Asignamos los estados al arreglo
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
    })
  }

  // Se ejecuta una vez que el archivo para procesar masivamente este listo
  onSubmit() {
    if(!parseInt(this.formAddress.get('postal_code')?.value!)) {
      this.toastr.warning("EL código postal tiene que ser un número", 'Advertencia', {
        timeOut: 3000,
        enableHtml: true
      });
      this.formAddress.get('postal_code')?.setValue(null);
      return;
    }
    this.errorMessages = '';
    if (this.formAddress.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }
    // Definimos el objecto para enviar la data
    const data = {
      state: this.state,
      municipality: this.municipality,
      city: this.city,
      settlement: this.settlement,
      settlement_type: this.settlement_type,
      zone: this.zone,
      postal_code: this.formAddress.get('postal_code')?.value,
      d_cp: this.formAddress.get('d_cp')?.value,
      c_state: this.formAddress.get('c_state')?.value,
      c_office: this.formAddress.get('c_office')?.value,
      c_cp: this.formAddress.get('c_cp')?.value,
      c_settlement_type: this.formAddress.get('c_settlement_type')?.value,
      municipality_key: this.formAddress.get('municipality_key')?.value,
      id_asenta_cpcons: this.formAddress.get('id_asenta_cpcons')?.value,
      c_cve_ciudad: this.formAddress.get('c_cve_ciudad')?.value,
    }
    this.submittedForm = true;
    this.apiAddress.addressStore(data).subscribe(
      (e: any) => {
        if (e.result) {
          this.toastr.success(e.message, 'Dirección agregada', {
            timeOut: 3000,
            enableHtml: true
          });
          this.dialogRef.close();
        } else {
          this.submittedForm = false;
          this.toastr.warning(e.message, 'Adverencia dirección', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        this.submittedForm = false;
        let message = this.utils.getErrorMessage(error);
        this.errorMessages = message;
        this.toastr.error(message, 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    );
  }

  // Se encarga de descargar el Excel para importar direcciones masivas
  downloadFileAddressImport(filename: string = "template_massive_address.xlsx") {
    this.disabledBtnExcel = true;
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    this.http.get(this.urlEndPoint + '/export/address-all', {headers, responseType: 'blob' as 'json'}).subscribe(
      (response: any) => {
        let dataType = response.type;
        let binaryData = [];
        binaryData.push(response);
        let downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        this.disabledBtnExcel = false;
      }
    )
  }

  // Permite validar el archivo que se subira sea excel
  importAddressFile(event: any) {
    this.uploadFile = true;
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileData = file;
    }
  }

  // Se ejecuta una vez que el archivo para procesar masivamente este listo
  importFileAddress() {
    this.errorMessages = '';
    // Validamos en caso de que no este valido algo del formulario
    if (!this.fileData) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }
    this.submittedForm = true;
    // Obtenemos los productos seleccionados
    var formData: any = new FormData();
    console.log(formData);
    // Agregamos el archivo cargado
    formData.append("file", this.fileData);
    // Consumimos el servicio web
    this.apiAddress.addressImportFile(formData).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.toastr.success(e.message, 'Importación de direcciones', {
            timeOut: 3000,
            enableHtml: true,
          });
        } else {
          this.toastr.warning(e.message, 'Advertencia', {
            timeOut: 3000,
            enableHtml: true,
          });
        }
      },
      (error) => {
        this.submittedForm = false;
        let message = this.utils.getErrorMessage(error);
        this.toastr.error(message, 'Error', {
          timeOut: 3000,
          enableHtml: true,
        });
      }
    );
  }
}