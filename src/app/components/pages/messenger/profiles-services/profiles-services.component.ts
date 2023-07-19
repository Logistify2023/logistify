import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'
import { ToastrService } from 'ngx-toastr';
import { MessengerService } from 'src/app/services/messenger.service';
import { MatDialog } from '@angular/material/dialog';

import { ProfilesServicesCreateComponent } from './create/create.component';
import { ProfilesServicesDetailsComponent } from './details/details.component';
import { ProfilesServicesUpdateComponent } from './update/update.component';
import { ProfilesServicesRestoreComponent } from './restore/restore.component';
import { ProfilesServicesDeleteComponent } from './delete/delete.component';
import { MatSort } from '@angular/material/sort';
import { DataTableConstants } from 'src/app/common/datatables-constants';

@Component({
  selector: 'app-profiles-services',
  templateUrl: './profiles-services.component.html',
  styleUrls: []
})

export class ProfilesServicesComponent implements OnInit {

  public totalResult      = DataTableConstants.ItemTotalAll;
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public paginaColor      = DataTableConstants.PaginarColor;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public loading          : boolean   = true;
  public displayedColumns : string[]  = ['profile', 'services', 'status', 'created_at', 'updated_at', 'details', 'update', 'restore', 'delete'];
  public dataSource       : any       = new MatTableDataSource<any>();
  public dataDeleted      : boolean   = false;

  @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort      = this.sort;
  }

  constructor(
    private apiMessenger: MessengerService,
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
    let listData = [];
    this.apiMessenger.getProfilesServices(0, false, true, false, false, false, this.dataDeleted).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        listData = e.data;
        this.totalResult      = listData.length;
        this.dataSource.data  = listData;
        
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

  openModalDetails(id: number) {
    const dialogRef = this.dialog.open(ProfilesServicesDetailsComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }

  openModalCreate() {
    const dialogRef = this.dialog.open(ProfilesServicesCreateComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }

  openModalUpdate(id: number) {
    const dialogRef = this.dialog.open(ProfilesServicesUpdateComponent, {
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }

  openModalRestore(id: number) {
    const dialogRef = this.dialog.open(ProfilesServicesRestoreComponent, {
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }

  openModalDelete(id: number) {
    const dialogRef = this.dialog.open(ProfilesServicesDeleteComponent, {
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