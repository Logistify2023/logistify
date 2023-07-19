import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

import { ClassificationsCreateComponent } from './create/create.component';
import { ClassificationsDetailsComponent } from './details/details.component';
import { ClassificationsUpdateComponent } from './update/update.component';
import { ClassificationsRestoreComponent } from './restore/restore.component';
import { ClassificationsDeleteComponent } from './delete/delete.component';
import { DataTableConstants } from 'src/app/common/datatables-constants';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-classifications',
  templateUrl: './classifications.component.html',
  styleUrls: []
})

export class ClassificationsComponent implements OnInit, AfterViewInit {

  public totalResult      = DataTableConstants.ItemTotalAll;
  public itemPerPage      = DataTableConstants.ItemPerPage;
  public alloFillter      = DataTableConstants.AllowFiltering;
  public paginaColor      = DataTableConstants.PaginarColor;
  public pageSizeOptions  = DataTableConstants.PageSizeOptions;
  public messageEmpty     = DataTableConstants.MessageForEmpty;
  public loading          : boolean   = true;
  public displayedColumns : string[]  = ['classification', 'status', 'created_at', 'updated_at', 'details', 'update', 'restore', 'delete'];
  public dataSource       : any       = new MatTableDataSource<any>();
  public dataDeleted      : boolean   = false;

  @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort      = this.sort;
  }

  constructor(
    private api: ApiService,
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
    this.api.getClassifications(true, this.dataDeleted).subscribe((e: any) => {
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

  openModalDetails(id: number) {
    const dialogRef = this.dialog.open(ClassificationsDetailsComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
  }
  
  openModalCreate() {
    const dialogRef = this.dialog.open(ClassificationsCreateComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  
  openModalUpdate(id: number) {
    const dialogRef = this.dialog.open(ClassificationsUpdateComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  
  openModalRestore(id: number) {
    const dialogRef = this.dialog.open(ClassificationsRestoreComponent, {
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  
  openModalDelete(id: number) {
    const dialogRef = this.dialog.open(ClassificationsDeleteComponent, {
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