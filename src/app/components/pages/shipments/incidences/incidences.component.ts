import { Component, OnInit, ViewChild } from '@angular/core';
import { ShipmentsService } from 'src/app/services/shipments.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';

import { IncidencesCreateComponent } from './create/create.component';
import { IncidencesDetailsComponent } from './details/details.component';
import { IncidencesUpdateComponent } from './update/update.component';
import { IncidencesRestoreComponent } from './restore/restore.component';
import { IncidencesDeleteComponent } from './delete/delete.component';
import { MatSort } from '@angular/material/sort';
import { DataTableConstants } from 'src/app/common/datatables-constants';

@Component({
  selector: 'app-incidences',
  templateUrl: './incidences.component.html',
  styleUrls: []
})

export class IncidencesComponent implements OnInit {

  public totalResult      = DataTableConstants.ItemTotalAll;
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public paginaColor      = DataTableConstants.PaginarColor;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public loading          : boolean   = true;
  public displayedColumns : string[]  = ['incidence', 'status', 'created_at', 'updated_at', 'details', 'update', 'restore', 'delete'];
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
    this.apiShipments.getIncidences(0, false, false, this.dataDeleted).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
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
    const dialogRef = this.dialog.open(IncidencesDetailsComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
  }
  
  openModalCreate() {
    const dialogRef = this.dialog.open(IncidencesCreateComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  
  openModalUpdate(id: number) {
    const dialogRef = this.dialog.open(IncidencesUpdateComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  
  openModalRestore(id: number) {
    const dialogRef = this.dialog.open(IncidencesRestoreComponent, {
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  
  openModalDelete(id: number) {
    const dialogRef = this.dialog.open(IncidencesDeleteComponent, {
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