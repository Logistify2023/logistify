import { QuoteMassiveDetailsComponent } from './details/details.component';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ShipmentsService } from './../../../../services/shipments.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { QuoteMassiveCreateComponent } from './create/create.component';
import { QuoteMassiveDeleteComponent } from './delete/delete.component';

@Component({
  selector: 'app-quote-massive',
  templateUrl: './quote-massive.component.html',
  styleUrls: []
})
export class QuoteMassiveComponent implements OnInit {
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['customer', 'products', 'rows', 'transactions', 'progress', 'difference', 'quote_start', 'status', 'details', 'restore', 'delete'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loading: boolean = false;
  dataDeleted: boolean = false;

  constructor(
    private apiShipments: ShipmentsService, 
    public dialog: MatDialog, 
    private toastr: ToastrService){
  }
  changeDeleteData() {
    this.dataDeleted = !this.dataDeleted;
    this.loadGridData();
  }
  ngOnInit(): void {
    this.loadGridData();
  }
  loadGridData() {
    this.loading = true;
    this.apiShipments.getMeQuotesMassive(true, true).subscribe((e: any) => {
      this.loading = false;
      if (e.result) {
        this.dataSource = new MatTableDataSource(e.data);
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
  openModalDetails(id: any) {
    const dialogRef = this.dialog.open(QuoteMassiveDetailsComponent, {
      width: '80vw',
      data: { _id: id, dataDeleted: this.dataDeleted },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalCreate() {
    const dialogRef = this.dialog.open(QuoteMassiveCreateComponent, {
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadGridData();
    });
  }
  openModalUpdate(id: number) {
   
  }
  openModalRestore(id: number) {
   
  }
  openModalDelete(id: number) {
    const dialogRef = this.dialog.open(QuoteMassiveDeleteComponent, {
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