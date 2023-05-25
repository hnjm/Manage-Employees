// import { Component, ElementRef, Inject, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { EmployeeService } from '../services/employee.service';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { SnackbarService } from '../services/snackbar.service';

// @Component({
//   selector: 'app-employee',
//   templateUrl: './employee.component.html',
//   styleUrls: ['./employee.component.scss']
// })
// export class EmployeeComponent implements OnInit{

//   employeeForm!: FormGroup;



//   constructor(
//     private formBuilder: FormBuilder,
//     private EmployeeService: EmployeeService,
//     private dialogRef: MatDialogRef<EmployeeComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private snackbarService: SnackbarService,
//     public _elementRef:ElementRef
//   ) {}

//   ngOnInit(): void {
//     this.getEmpList();
//     this .empForm();
//     this.employeeForm.patchValue(this.data);
//   }

//   getEmpList(){
//     this.EmployeeService.getEmployees().subscribe({
//       next:(res) => {
//         console.log(res)
//       }
//     })

//   }

//   onSubmit() {
//     var btns = document.getElementById('buttons')

//     btns?.setAttribute("disabled", "true")

//     if (this.employeeForm.valid) {
//       if(this.data){
//         this.EmployeeService.updateEmployee(this.data.id,this.employeeForm.value).subscribe({
//           next:(res) => {
//             console.log(res);
//             // alert("Employee updated successfuly...")
//             this.snackbarService.openSnackBar('Employee updated successfuly...', 'Done')

//             this.getEmpList();

//             this.dialogRef.close(true);

//           },
//           error: (err)=>{console.log(err)},
//           complete: () => {    btns?.setAttribute("disabled", "false")  }
//         })

//       } else {
//         console.log(this.employeeForm.value)
//         this.EmployeeService.createEmployee(this.employeeForm.value).subscribe({
//           next:(res) => {
//             console.log(res);
//             // alert("Employee added successfuly...")
//             this.snackbarService.openSnackBar("Employee added successfuly...", 'Done')
//             this.getEmpList();
//             this.dialogRef.close(true);
//           },
//           error: (err)=>{console.log(err)},
//           complete: () => {    btns?.setAttribute("disabled", "false")  }

//         })

//       }
//     }
//     // console.log(this.employeeForm.value)
//   }

//   empForm(){
//     this.employeeForm = this.formBuilder.group({
//       id: ['0'],
//       name: ['', Validators.required],
//       'email': ['',[Validators.required,Validators.pattern(/^[\w.-]+@[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+$/)]],
//       mobile: ['', [Validators.required, Validators.pattern('^(011|012|010)\\d{8}$')]],
//       address: ['', Validators.required]
//     });

//   }


// }



import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../services/snackbar.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  employeeForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private dialogRef: MatDialogRef<EmployeeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbarService: SnackbarService,
    public _elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.getEmpList();
    this.empForm();
    this.employeeForm.patchValue(this.data);
  }

  getEmpList() {
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        console.log(res);
      }
    });
  }

  onSubmit() {
    var btns = document.getElementById('buttons');

    btns?.setAttribute('disabled', 'true');

    if (this.employeeForm.valid) {
      const email = this.employeeForm.get('email')?.value;
      const mobile = this.employeeForm.get('mobile')?.value;

      if (this.data) {
        this.employeeService.getEmployeeByEmailOrMobile(email, mobile).subscribe({
          next: (res) => {
            if (res.length === 0 || res[0].id === this.data.id) {
              this.updateEmployee();
            } else {
              this.snackbarService.openSnackBar('Email or phone already exists!', 'Error');
              btns?.removeAttribute('disabled');
            }
          },
          error: (err) => {
            console.log(err);
            btns?.removeAttribute('disabled');
          }
        });
      } else {
        this.employeeService.getEmployeeByEmailOrMobile(email, mobile).subscribe({
          next: (res) => {
            if (res.length === 0) {
              this.createEmployee();
            } else {
              this.snackbarService.openSnackBar('Email or phone already exists!', 'Error');
              btns?.removeAttribute('disabled');
            }
          },
          error: (err) => {
            console.log(err);
            btns?.removeAttribute('disabled');
          }
        });
      }
    }
  }

  updateEmployee() {
    this.employeeService.updateEmployee(this.data.id, this.employeeForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.snackbarService.openSnackBar('Employee updated successfully...', 'Done');
        this.getEmpList();
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        var btns = document.getElementById('buttons');
        btns?.removeAttribute('disabled');
      }
    });
  }

  createEmployee() {
    this.employeeService.createEmployee(this.employeeForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this.snackbarService.openSnackBar('Employee added successfully...', 'Done');
        this.getEmpList();
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        var btns = document.getElementById('buttons');
        btns?.removeAttribute('disabled');
      }
    });
  }

  empForm() {
    this.employeeForm = this.formBuilder.group({
      id: ['0'],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(/^[\w.-]+@[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)+$/)]],
      mobile: ['', [Validators.required, Validators.pattern('^(011|012|010)\\d{8}$')]],
      address: ['', Validators.required]
    });
  }
}
