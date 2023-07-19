import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-collaborators-details',
  templateUrl: './details.component.html'
})

export class CollaboratorsDetailsComponent implements OnInit {
  objectDetails: any = {};
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['courier_type', 'description', 'status'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  infoImage: any;
  constructor(
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CollaboratorsDetailsComponent>,
    private apiService: ApiService,
    private apiUtils: UtilsService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.apiService.getUserById(this.data._id, true, true, true, true, true, true, true, false, false, true, this.data.dataDeleted).subscribe((e: any) => {
      if (e.result) {
        this.objectDetails = e.data;
        if (this.objectDetails) {
          this.apiUtils.getImage(this.objectDetails.image.id).subscribe((e: any) => {
            this.infoImage = e.data;
          });
        }
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
}