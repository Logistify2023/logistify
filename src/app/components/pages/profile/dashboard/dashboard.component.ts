import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatGridList } from '@angular/material/grid-list';
import { combineLatest, count, startWith } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { MeProfileService } from 'src/app/services/meProfile.service';

import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/common/format-datepicker';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS}
  ]
})

// Exportamos el componente
export class DashboardComponent implements OnInit, AfterViewInit {
  // Almacenamos las fechas
  public fecha_hoy = new Date();
  public fecha_ant = new Date();
  // Asignamos las fechas al rango de fechas
  public range = new FormGroup({
    start: new FormControl<Date | null>(this.fecha_ant),
    end: new FormControl<Date | null>(this.fecha_hoy),
  });
  // Para saber cuando esta consumiendo la api
  public loanding: boolean = false;
  public pageSizeOptions = [15, 30, 50, 70, 100];
  public pageSize = 30;
  public shipmentsTotal = 0;
  public paginarColor = "warn";
  public loading: boolean = true;
  public dataDeleted: boolean = false;
  public displayedColumns: string[] = ['guide', 'track', 'cliente', 'producto', 'peso', 'estado'];
  public dataSource = new MatTableDataSource<any>();
  
  @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  // Permite almacenar los estados de las guías
  public guides: any = {
    generated: 0,
    active: 0,
    inTransit: 0,
    onRoute: 0,
    incidence: 0,
    delivered: 0,
    canceled: 0,
  };
  // Permite almacenar los valores del nivel de servicio
  public levelService :any = [
    ['Mejor tiempo', 0, '#e215af'],
    ['En tiempo', 0, '#6e15e2'],
    ['Fuera de tiempo', 0, '#e2c315'],
  ];
  // Permite almancenar a los clientes con el peso y volumen realizado
  public customersVolum : any[] = [];
  
  // Definimos las columnas para los grids en las posibles ventanas
  public columsShipments: string[] = ['guide', 'track', 'key', 'bell', 'generated_date', 'send_date', 'delivered_date', 'type', 'status'];
  public columsQuotes:    string[] = ['cliente', 'perfil', 'mensajeria', 'servicio', 'guia', 'origen', 'destino', 'piezas', 'peso', 'estado'];
  public columsInTransit: string[] = ['cliente', 'perfil', 'mensajeria', 'servicio', 'guia', 'origen', 'destino', 'piezas', 'peso', 'estado'];
  public columsOnRoute:   string[] = ['cliente', 'perfil', 'mensajeria', 'servicio', 'guia', 'origen', 'destino', 'piezas', 'peso', 'estado'];
  public columsIncidence: string[] = ['cliente', 'perfil', 'mensajeria', 'servicio', 'guia', 'origen', 'destino', 'piezas', 'peso', 'estado'];
  public columsDelivery:  string[] = ['cliente', 'perfil', 'mensajeria', 'servicio', 'guia', 'origen', 'destino', 'piezas', 'peso', 'estado'];
  public columsCanceled:  string[] = ['cliente', 'perfil', 'mensajeria', 'servicio', 'guia', 'origen', 'destino', 'piezas', 'peso', 'estado'];

  columsDetails_Shipments: string[] = ['guide', 'track', 'key', 'bell', 'generated_date', 'send_date', 'delivered_date', 'type', 'status'];
  columsDetails_Quotes: string[]    = ['origin_full', 'destin_full', 'pieces', 'ship_type', 'status'];
  columsDetails_Losses: string[]    = ['invoice', 'date', 'amount', 'product_name', 'status'];
  columsDetails_Customers: string[] = ['rfc', 'business_name', 'type_custumer', 'status'];

  countShipments: number = 0;
  listShipments: any = [];
  countQuotes: number = 0;
  listQuotes: any = [];
  countLosses: number = 0;
  listLosses: any = [];
  countCustomers: number = 0;
  listCustomers: any = [];

  // Grafica para mostrar los niveles de servicio
  public charDataLevelService: any = {
    title: 'Nivel de servicio',
    type: 'BarChart',
    data: this.levelService,
    columnNames: ['Element', 'Volum', { role: 'style' }],
    options: {
      hAxis: {
        title: 'Guías generadas',
      },
      vAxis: {
        title: 'Nivel de servicio',
      },
    },
    width: "300%",
    height: "150%",
  };

  // Define la información de la segunda grafica
  chartData2: any = {
    title: '',
    // title: 'Segunda Grafica - Lineas(LineChart)',
    type: 'LineChart',
    data: [
      ["Jan", 7.0, -0.2, -0.9, 3.9, 9.2],
      ["Feb", 16.9, 40.8, 1.6, 24.2, 46.8],
      ["Mar", 29.5, 34.7, 22.5, 45.7, 28.4],
      ["Apr", 34.5, 21.3, 33.4, 8.5, 13.6],
      ["May", 48.2, 17.0, 43.5, 31.9, 48.9],
      ["Jun", 11.5, 2.0, 7.0, 5.2, -1.1],
      ["Jul", 25.2, 44.8, 18.6, 47.0, 33.2],
      ["Aug", 36.5, 34.1, 27.9, 16.6, 12.4],
      ["Sep", 43.3, 20.1, 34.3, 34.2, 45.2],
      ["Oct", 18.3, 14.1, 45.0, 10.3, 36.2],
      ["Nov", 23.9, 8.6, 2.9, 6.6, 12.6],
      ["Dec", 39.6, 42.5, 12.0, 4.8, 30.3],
    ],
    columnNames: ["DHL", "UPS", "ESTAFETA","FEDEX", "PAQUETE", "LOGISTIFY"],
    options: {
      hAxis: {
        title: 'Meses',
      },
      vAxis: {
        title: 'Volumentria',
      },
     pointSize: 5,
    },
    width: "300%",
    height: "150%",
  };

  // Definimos los datos de la tercera grafica
  chartData3: any = {
    title: '',
    // title: 'Tercera Grafica - Histograma(Histogram)',
    type: 'Histogram',
    data: [
      ["1", 80],["2", 55],["3", 45],["4", 80],["5", 54],
      ["6", 0],["7", 45],["8", 78],["9", 7],["10", 18],
      ["11", 90],["12", 65],["13", 38],["14", 82],["15", 65],
      ["16",100],["17", 45],["18", 62],["19", 84],["20", 75],
      ["21", 12],["22", 15],["23", 28],["24", 70],["25", 5],
    ],
    columnNames: ["Paquetera", "Guías"],
    options: {
      legend: 'none'
    },
    width: "300%",
    height: "150%",
  };

  // Definimos los datos de la cuarta grafica
  chartData4: any = {
    title: 'Clientes volumen',
    // title: 'Cuarta Grafica - Burbujas(BubbleChart)',
    type: 'BubbleChart',
    data: [
      ["Neogen", 8, 12],
      ["Vips", 4, 5.5],
      ["Oro", 11, 14],
      ["Plata", 3, 3.5],
      ["Bronce", 6.5, 7],
    ],
    columnNames: ['Perfil', 'Peso','Volumen'],
    options: { },
    width: "300%",
    height: "150%",
  };

  // Definimos los datos de la quinta grafica
  chartData5: any = {
    title: '',
    // title: 'Quinta Grafica - Arbol de Mapas(TreeMap)',
    type: 'TreeMap',
    data: [
      ["Global", null, 0,0],
      ["America", "Global", 0,0],
      ["Europe", "Global", 0,0],
      ["Asia", "Global", 0,0],
      ["Australia", "Global", 0,0],
      ["Africa", "Global", 0,0],

      ["USA", "America", 52,31],
      ["Mexico", "America", 24,12],
      ["Canada", "America", 16,-23],

      ["France", "Europe", 42,-11],
      ["Germany", "Europe", 31,-2],
      ["Sweden", "Europe", 22,-13],

      ["China", "Asia", 36,4],
      ["Japan", "Asia", 20,-12],
      ["India", "Asia", 40,63],

      ["Egypt", "Africa", 21,0],
      ["Congo", "Africa", 10,12],
      ["Zaire", "Africa", 8,10],
    ],
    columnNames: ["Location", "Parent","Market trade volume (size)","Market increase/decrease (color)"],
    options: {
      minColor: "#ff7777",
      midColor: '#ffff77',
      maxColor: '#77ff77',
      headerHeight: 15,
      showScale: true,
    },
    width: "300%",
    height: "150%",
  };

  // Definimos los datos para la sexta grafica
  chartData6: any = {
    title: '',
        // title: 'Sexta Grafica - Velas(CandlestickChart)',
    type: 'CandlestickChart',
    data: [
      ["Mon", 20, 28, 38, 45],
      ["Tue", 31, 38, 55, 66],
      ["Wed", 50, 55, 77, 80],
      ["Thu", 77, 77, 66, 50],
      ["Fri", 68, 66, 22, 15]
    ],
    columnNames: ['Servicio', 'Dia Siguiente','Terrestre','MismoDía','Dos Días'],
    options: {
      legend:'none',
      candlestick: {
        fallingColor: { strokeWidth: 2, stroke:'#a52714' },
        risingColor: { strokeWidth: 2, stroke: '#0f9d58' },
      },
    },
    width: "300%",
    height: "150%",
  };

  // Definimos los datos para la septima grafica
  chartData7: any = {
    title: '',
        // title: 'Septima Grafica - Barras(BarChart)',
    type: 'BarChart',
    data: [
      ["2012", 900, 390, 532, 652, 523, 985],
      ["2013", 1000, 400, 220, 623, 1, 646],
      ["2014", 110, 440, 743, 754, 764, 724],
      ["2015", 125, 480, 853, 754, 435, 114],
      ["2016", 530, 547, 397, 0, 658, 434]
    ],
    columnNames: ['Año', 'DHL','UPS', 'FED', 'EST', 'PAQ', 'LOG'],
    options: {
      hAxis: {
        title: 'Año'
      },
      vAxis:{
        minValue: 0
      },
      isStacked: true,
    },
    width: "300%",
    height: "150%",
  };

  // Definimos los datos para la octava grafica
  chartData8: any = {
    title: '',
        // title: 'Octaba Grafica - Pastel(PieChart)',
    type: 'PieChart',
    data: [
      ['Animal Neogen', 45.0],
      ['Benetton Mexicana', 26.8],
      ['Blanca', 12.8],
      ['DGL Latam', 8.5],
      ['DGL Electra', 6.2],
      ['Esporadicos', 0.7],
      ['Dominoz', 1.7],
      ['otros', 0.2],
    ],
    columnNames: ['Cliente', 'Porcentajes'],
    options: {
      slices: {
        1: {offset: 0.2},
        3: {offset: 0.3}
      },
    },
    width: "300%",
    height: "150%",
  };

  // Definimos los datos para la novena grafica
  chartData9: any = {
    title: '',
        // title: 'Novena Grafica - Tabla(Table)',
    type: 'Table',
    data: [
      ['Mike', {v: 10000, f: '$10,000'}, true],
      ['Jim', {v:8000, f: '$8,000'}, false],
      ['Alice', {v: 12500, f: '$12,500'}, true],
      ['Bob', {v: 7000, f: '$7,000'}, true],
    ],
    columnNames: ["Nombre", "Monto", "Estado"],
    options: {
      alternatingRowStyle:true,
      showRowNumber:true
    },
    width: "300%",
    height: "150%",
  };

  // Definimos los datos para la decima tabla
  chartData10: any = {
    // title: 'Decima Grafica - Area Escalonada(SteppedAreaChart)',
    title: '',
    type: 'SteppedAreaChart',
    data: [
      ["Alfred Hitchcock (1935)", 8.4, 7.9],
      ["Ralph Thomas (1959)", 6.9, 6.5],
      ["Don Sharp (1978)", 6.5, 6.4],
      ["James Hawes (2008)", 4.4, 6.2],
    ],
    columnNames: ['Director (Year)', 'Rotten Tomatoes','IMDB'],
    options: {
      vAxis:{
        title:'Accumulated Rating'
      },
      isStacked:true,
    },
    width: "300%",
    height: "150%",
  };

  // Cargamos los servicios en nuestro constructor
  constructor(
    private _api: ApiService,
    private _apiDash: MeProfileService,
    private toastr: ToastrService,
  ) { }

  // Iniciamos la data cargada
  ngOnInit(): void {
    // A la fecha antes le asignamos restandole un mes a la fecha de hoy
    this.fecha_ant.setMonth(this.fecha_hoy.getMonth() - 1);
    // Obtenemos la información de acuerdo a las fechas
    this.getDataForDashboard();
  }

  // Permite traer la información completa para los servicios web
  getDataForDashboard() {
    this.loanding = true;
    let start = this.range.get('start')?.value;
    let end = this.range.get('end')?.value;
    this._apiDash.getDashboardMaster(start, end).subscribe((e: any) => {
      this.loanding = false;
      if(e.result) {
        if (e.data.length <= 0) {
          this.loanding = false;
          this.toastr.warning("No se encontro información entre las fechas seleccionadas", 'No hay información', {
            timeOut: 3000,
            enableHtml: true
          });
        }
        // Asignamos las variables correspondientes para trabajarla acoder a cada componenete
        let guides    :any = (e.data.guides) ? e.data.guides : [];
        let levels    :any = (e.data.levels) ? e.data.levels : [];
        let products  :any = (e.data.products) ? e.data.products : [];
        let couriers  :any = (e.data.couriers) ? e.data.couriers : [];
        let customers :any = (e.data.customers) ? e.data.customers : [];
        let users     :any = (e.data.users) ? e.data.users : [];
        let envios    :any = (e.data.shipments) ? e.data.shipments : [];

        // Asignamos a las estados de las guias el valor correspondiente
        this.guides.generated = guides.generadas;
        this.guides.active    = guides.activas;
        this.guides.inTransit = guides.enTransito;
        this.guides.onRoute   = guides.enRuta;
        this.guides.incidence = guides.inicidencia;
        this.guides.delivered = guides.entregadas;
        this.guides.canceled  = guides.canceladas;

        // Asignamos la información correspondiente para los clientes
        /* ["Neogen", 8, 12],
        ["Vips", 4, 5.5],
        ["Oro", 11, 14],
        ["Plata", 3, 3.5],
        ["Bronce", 6.5, 7], */
        let arrayClientes = [];
        /* customers.forEach((key: any) => {
          console.log("KEY: " + key);
          // console.log("VALUE: " + value);  
        }); */

        // Asignamos a los niveles de servicio el valor correspondiente
        this.levelService[0][1] = (levels.mejor_tiempo) ? levels.mejor_tiempo : 0;
        this.levelService[1][1] = (levels.en_tiempo) ? levels.en_tiempo : 0;
        this.levelService[2][1] = (levels.fuera_tiempo) ? levels.fuera_tiempo : 0;

        // Asignamos a los clientes el nivel de volumen y peso
        /* let _customers : any = [];
        customers.forEach((customer: any) => {
          _customers.push[customer];
        });
        console.log(_customers); */

        // Asignamos los envios a la tabla
        envios.forEach((i: any) => {
          i.cliente     = i.customer.business_name;
          i.producto    = i.service.service;
          i.peso        = i.quote_intern.weight_search;
          i.estado      = (i.statuse) ? i.statuse.state : "SIN ESTADO";
        });
        this.shipmentsTotal = envios.length;
        this.dataSource.data = envios;
        setTimeout(()=>this.dataSource.sort = this.sort);
        setTimeout(()=>this.dataSource.paginator = this.paginator);
        
      }
    }, (error: any) => {
      this.loanding = false;
      this.toastr.error(error.message, 'Petición fallida', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }
  
  // Despues de la vista cargamos la data
  ngAfterViewInit(): void {

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    combineLatest([
      this._api.userShipments(),
      this._api.userLosses(),
      this._api.userCustomers(),
      this._api.userQuotes(),
    ]).subscribe(([shipments, losses, customers, quotes]) => {
      if (shipments.result) {
        this.listShipments = shipments.data;
        this.countShipments = this.listShipments.length;
      }
      if (losses.result) {
        this.listLosses = losses.data;
        this.countLosses = this.listLosses.length;
      }
      if (customers.result) {
        this.listCustomers = customers.data;
        this.countCustomers = this.listCustomers.length;
      }
      if (quotes.result) {
        this.listQuotes = quotes.data;
        this.listQuotes.forEach((i: any) => {
          i.origin_full = '';
          i.destin_full = '';
          if (i.origin) {
            i.origin_full = i.origin.city + ' ' + i.origin.state + ' CP.' + i.origin.postal_code;
          }
          if (i.destin) {
            i.destin_full = i.destin.city + ' ' + i.destin.state + ' CP.' + i.destin.postal_code;
          }
        });
        this.countQuotes = this.listQuotes.length;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
