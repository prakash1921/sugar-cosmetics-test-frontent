import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
// import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  // @ViewChild('inputFile') myInputVariable: ElementRef;

  title = 'frontent';
  myForm: any = [];
  images: any = [];
  submitted = false;
  isImage:boolean=true;
  iscode:boolean=false;
  iscodevalid:boolean=false;
  duplicatedata: boolean = false;
  constructor(
    public route: Router, public fb: FormBuilder, public router: Router, public http: HttpClient,public toastr: ToastrManager) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      'name': ['', Validators.required],
      'email': ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      // 'password': ['', [Validators.required, Validators.minLength(6)]],
      'mobileno': ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10), Validators.pattern("(?:(?:\\+|0{0,2})91(\\s*[\\- ]\\s*)?|[0 ]?)?[6789]\\d{9}|(\\d[ -]?){10}\\d")]],
      'address': ['', Validators.required],
      'uniquecode': ['', Validators.required],
      // 'img': ['', Validators.required),
    })
  }


  get f() { return this.myForm.controls; }

  onSubmit() {
    console.log(this.myForm.value);
    // var bodys=[this.myForm.value]
    this.submitted = true;

    // stop here if form is invalid
    if(this.images.length!=0){
      this.isImage=true;
    }else{
      this.isImage=false;
    }
    if (this.myForm.invalid) {
        return;
    }
    
    // console.log("f",this.isImage)
    const formdatagg = new FormData();
    formdatagg.append('name',this.myForm.value.name)
    formdatagg.append('email',this.myForm.value.email)
    formdatagg.append('mobileno',this.myForm.value.mobileno)

    formdatagg.append('address',this.myForm.value.address)
    formdatagg.append('uniquecode',this.myForm.value.uniquecode)

    
    formdatagg.append('file', this.images[0])

console.log('file',this.images)
if(this.images.length!=0){
  this.http.post<any>('http://localhost:8000/user/add', formdatagg).subscribe(data => {

    console.log('fff', data);
    if(data){
      // this.myForm.reset();
      this.myForm.setValue({
        'name': [''],
      'email': [''],
      // 'password': ['', [Validators.required, Validators.minLength(6)]],
      'mobileno': [''],
      'address': [''],
      'uniquecode': [''],
      })
      this.toastr.successToastr('Data Saved Successfully', 'Success!');
      this.myForm.nativeElement.value=''
      this.submitted = false;
    }

  })
}
    
  }
  uniquecheck(){
    this.myForm.value.uniquecode;
    this.http.get<any>('http://localhost:8000/user/uniquecheck?'+'code='+this.myForm.value.uniquecode).subscribe(data => {
if(data.length!=0){
  this.iscode=false;
  if(data[0].valid==false){
    this.iscodevalid=true;

  }else{
    this.iscodevalid=false;
  }

}else{
  this.iscode=true;
  this.iscodevalid=false;
}
      console.log('fff', data)

    })
  }
  upload(e) {
    console.log('e', e)
    this.images = [];
    if (e.target.files.length > 0) {
      this.images.push(e.target.files[0]);
      this.isImage=true;
    }
    console.log('ggg',this.images)


  }
  
  changevalue() {
    this.duplicatedata = false
  }

  
  unique() {

    var body = this.myForm.value.name;
    this.http.get<any>('http://localhost:8000/user/usercheck?name='+ body).subscribe(data => {
      if (data.length != 0) {
        this.duplicatedata = true
      }

    })
    

  }

}
