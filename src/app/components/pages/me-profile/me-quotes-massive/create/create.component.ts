import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global-constants';
import { CustomerService } from 'src/app/services/customer.service';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { MeProfileService } from 'src/app/services/meProfile.service';
import { Utils } from 'src/app/common/utils';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: []
})

// Exportamos el componente
export class MeQuotesMassiveCreateComponent implements OnInit {

  // Definimos las variables a utilizar
  urlEndPoint:        string      = GlobalConstants.apiURL;
  formGroup:          FormGroup;
  errorMessages:      string      =  '';
  uploadFile:         boolean     = false;
  submittedForm:      boolean     = false;
  listCustomers:      any[]       = [];
  listServicesClient: any[]       = [];
  customer_id:        number;
  num_packages:       number      = 0;
  num_envelopes:      number      = 0;
  multipieza:         number      = 0;
  disabledBtnExcel:   boolean     = false;
  downloadTemplate:   boolean     = false;

  // Definimos los servicios que haremos uso
  constructor(
    private formBuilder:  FormBuilder,
    public dialogRef:     MatDialogRef<MeQuotesMassiveCreateComponent>,
    private apiCustomer:  CustomerService,
    private apiMeProfile: MeProfileService,
    private apiShipment:  ShipmentsService,
    private utils:        Utils,
    private toastr:       ToastrService,
    private http:         HttpClient,
  ) { 
    this.formGroup = this.formBuilder.group({
      id_customer: new FormControl('', [Validators.required]),
      products: new FormControl('', [Validators.required]),
      file: new FormControl('', []),
      package_quantity: new FormControl('', [Validators.nullValidator]),
      envelope_quantity: new FormControl('', [Validators.nullValidator]),
      package_multipece_quantity: new FormControl('', [Validators.nullValidator]),
    });
  }

  // Cargamos la informacion del cliente
  ngOnInit(): void {
    // Get customers
    this.apiMeProfile.getMeCustomersBasic().subscribe((e: any) => {
      this.listCustomers = e.data;
    });
    /* this.apiCustomer.getClients(0, false, false, false, false, false, false, false, false, false, true, false, false, false, true, true, false, false, false, false).subscribe((e: any) => {
      this.listCustomers = e.data;
    }); */
  }

  // Permite cargar la información de los productos cuando cambia el cliente
  chageClientSelected() {
    this.downloadTemplate = false;
    this.apiCustomer.getClient(this.customer_id).subscribe((e: any) => {
      this.listServicesClient = e.data.profile_services;
    });
  }

  // Se encarga de descargar el Excel para una cotuzacíon masiva
  downloadFileQuote(customer_id: number, num_packages: number, num_envelopes: number, multipieza: number, filename: string = "template_massive_quote.xlsx") {
    this.disabledBtnExcel = true;
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    this.http.get(this.urlEndPoint + '/export/massive-quote?' + 'customer_id=' + customer_id + '&num_packages=' + num_packages + '&num_envelopes=' +  num_envelopes + '&multipieza=' + multipieza, {headers, responseType: 'blob' as 'json'}).subscribe(
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

  // Permite saber si se puede exportar el template con la información correspondiente
  export() {
    this.errorMessages = '';
    if(this.formGroup.invalid) {
      this.errorMessages = 'Verifica los datos';
      return;
    }
  
    if(this.num_packages == 0 && this.num_envelopes == 0) {
      this.errorMessages = 'Ingresa al menos un paquete o sobre que sea mayor a 0';
      return;
    }else{
      this.toastr.success('Plantilla generada exitosamente');
      this.downloadTemplate = true;
    } 
  }

  // Almacena la información del archivo a importar
  fileData: any;
  // Permite validar el archivo que se subira sea excel
  importAdditional(event: any) {
    this.uploadFile = true;
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
    }
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.fileData = file;
      this.formGroup.patchValue({
        file: this.fileData,
      });
    }
  }

  // Se ejecuta una vez que el archivo para procesar masivamente este listo
  onSubmit() {
    this.errorMessages = '';
    const form = this.formGroup;
    // Validamos en caso de que no este valido algo del formulario
    if (form.invalid) {
      this.errorMessages = 'Verifica los datos.';
      return;
    }
    this.submittedForm = true;
    // Obtenemos los productos seleccionados
    var formData: any = new FormData();
    form.get('products')?.value.forEach((i: any) => {
      formData.append("products[]", i);
    });
    // Agregamos el archivo cargado
    formData.append("file", this.fileData);
    // Consumimos el servicio web
    this.apiShipment.importQuoteMassive(this.customer_id, formData).subscribe(
      (e: any) => {
        this.submittedForm = false;
        if (e.result) {
          this.dialogRef.close(true);
          this.toastr.success(e.message, 'Cotización', {
            timeOut: 3000,
            enableHtml: true
          });
        } else {
          this.toastr.warning(e.message, 'Advertencia', {
            timeOut: 3000,
            enableHtml: true
          });
        }
      },
      (error) => {
        this.submittedForm = false;
        let message = this.utils.getErrorMessage(error);
        this.toastr.error(message, 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    );
  }
}
