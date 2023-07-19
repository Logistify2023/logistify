import { Component, OnInit, ViewChild } from '@angular/core';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { QuoteCreateComponent } from './create/create.component';
import { QuoteDetailsComponent } from './details/details.component';
import { QuoteUpdateComponent } from './update/update.component';
import { QuoteRestoreComponent } from './restore/restore.component';
import { QuoteDeleteComponent } from './delete/delete.component';
import { MatSort } from '@angular/material/sort';
import { DataTableConstants } from 'src/app/common/datatables-constants';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: []
})

export class QuoteComponent implements OnInit {
  
  public totalResult      = DataTableConstants.ItemTotalAll;
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public paginaColor      = DataTableConstants.PaginarColor;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public loading          : boolean   = true;
  public displayedColumns : string[]  = ['origin_full', 'destin_full', 'pieces', 'ship_type', 'status', 'created_at', 'updated_at', 'details', 'update', 'restore', 'delete'];
  public dataSource       : any       = new MatTableDataSource<any>();
  public dataDeleted      : boolean   = false;

  @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort      = this.sort;
  }

  constructor(
    private apiShipments: ShipmentsService,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) { }

  changeDeleteData() {
    this.dataDeleted = !this.dataDeleted;
    this.loadGridData();
  }
  
  ngOnInit(): void {
    this.loadGridData();
  }
  
  loadGridData() {
    this.loading = true;
    this.apiShipments.getQuote(0, false, false, false, false, this.dataDeleted).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        e.data.forEach((i: any) => {
          i.origin_full = i.origin.city + ' ' + i.origin.state + ' CP.' + i.origin.postal_code;
          i.destin_full = i.destin.city + ' ' + i.destin.state + ' CP.' + i.destin.postal_code;
        });
        
        this.totalResult      = e.data.length;
        this.dataSource.data  = e.data;
        
        setTimeout(()=>this.dataSource.sort = this.sort);
        setTimeout(()=>this.dataSource.paginator = this.paginator);
      } else {
        this.toastr.error(e.message, 'Error', {
          timeOut: 3000,
          enableHtml: true
        });
      }
    }, (err: any) => {
      this.loading = false;
      this.toastr.error(err.error.message, 'Error', {
        timeOut: 3000,
        enableHtml: true
      });
    });
  }

  /* ACTIONS */
  openModalDetails(id: number) {
    const dialogRef = this.dialog.open(QuoteDetailsComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
  }
  
  openModalCreate() {
    const dialogRef = this.dialog.open(QuoteCreateComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  
  openModalUpdate(id: number) {
    const dialogRef = this.dialog.open(QuoteUpdateComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  
  openModalRestore(id: number) {
    const dialogRef = this.dialog.open(QuoteRestoreComponent, {
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  
  openModalDelete(id: number) {
    const dialogRef = this.dialog.open(QuoteDeleteComponent, {
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}