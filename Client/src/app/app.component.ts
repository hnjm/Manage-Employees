import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeService } from './services/employee.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { SnackbarService } from './services/snackbar.service';
import {SelectionModel} from '@angular/cdk/collections';
import { NgxSpinnerService } from "ngx-spinner";
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['select', 'name', 'email', 'mobile', 'address', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  selection = new SelectionModel<any>(true, []);
  // selectthing?: number

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  employees:any

  constructor(private _matDialog : MatDialog,
      private EmployeeService: EmployeeService,
       private snackbarService: SnackbarService,
       private spinner: NgxSpinnerService,
       private cdr: ChangeDetectorRef) { }
  ngAfterViewInit(): void {
    this.sort.disableClear= true;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }
  ngOnInit(): void {
   this.getEmployeeList();
   this.spinner.show();

  }


    isAllSelected() {
      const numSelected = this.selection.selected.length;
      // this.selectthing = numSelected;
      const numRows = this.dataSource.filteredData.length;
      return numSelected === numRows;
    }


        /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }


  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'Deselect' : 'Select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'Deselect' : 'Select'} row ${row.position + 1}`;
  }





  openAddEditeEmpForm() {
    const dialogConfig = new MatDialogConfig();

    const dialogRef = this._matDialog.open(EmployeeComponent, {
      width: '300px',
      // position: { top: '100px', left: '420px' },
});

    dialogRef.afterOpened().subscribe({
      next:(val:any) => {
        // const dialogContainer = dialogRef.componentInstance._elementRef.nativeElement.parentNode;
        // dialogContainer.classList.add('custom-dialog-container');
        if (val) {
          this.getEmployeeList();
        }

      }
    });

    dialogRef.afterClosed().subscribe((val) => {
      if (val) {
        this.getEmployeeList();
      }
    });
  }




  getEmployeeList(){
    this.EmployeeService.getEmployees().subscribe({
      next:(res:any) => {
        console.log(res)
        this.employees = res;
        this.employees.sort((a:any,b:any)=>{
          if(a.name){
            if (a.name.toLowerCase().trim() > b.name.toLowerCase().trim()) {
              return 1;
            }
            if (a.name.toLowerCase().trim() < b.name.toLowerCase().trim()) {
              return -1;
            }
          }

          return 0;
        })
        console.log(this.employees)
        this.dataSource = new MatTableDataSource(this.employees)
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error:(err) => {console.log(err)},
      complete:() => {
        this.spinner.hide();
      }
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  deleteEmployee(id: number) {
    const dialogRef = this.openDialog();

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.EmployeeService.deleteEmployee(id).subscribe({
          next: () => {
            this.snackbarService.openSnackBar('Employee deleted!', 'Done');
            this.getEmployeeList();
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => { this.selection.clear();}
        });
      }
    });
  }





  openDialog(enterAnimationDuration: string = '0', exitAnimationDuration: string = '0'): MatDialogRef<DeleteDialogComponent> {
    return this._matDialog.open(DeleteDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      position: { top: '0px', left: '480px' },

    });
  }





  deleteEmployees() {
    const selectedIds = this.selection.selected.map(employee => employee.id);

    const dialogRef = this.openDialog();

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result === 'yes') {
        this.EmployeeService.deleteEmployees(selectedIds).subscribe({
          next: () => {
            alert('Employees deleted!');
            this.snackbarService.openSnackBar('Employees deleted!', 'Done');
            this.selection.clear();
            this.getEmployeeList();
          },
          error: (err) => {
            console.log(err);
            console.log(result)

          }
        });
      }
    });
  }




  openEditeEmpForm(data: any){
    const dilaogRef = this._matDialog.open(EmployeeComponent, {
      data,
      width: '400px',

    });

    dilaogRef.afterClosed().subscribe({
      next: (val) => {
        if(val){
          this.getEmployeeList();
        }
      }
    })


    this.EmployeeService.updateEmployee(data.id, data).subscribe({
      next: (res) => {
        console.log(res);
        this.getEmployeeList();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }



}
