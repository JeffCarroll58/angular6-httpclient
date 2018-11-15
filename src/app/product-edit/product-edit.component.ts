import { Component, OnInit, Input } from '@angular/core';
import { RestService } from '../rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  @Input() productData:any = { id: 0, prod_name: '', prod_desc: '', prod_price: 0 };
  editForm: FormGroup;
  id: number;
  submitted = false;


    constructor(private formBuilder: FormBuilder, public rest: RestService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
      let  numericPattern = '^[1-9]\\d*(\\.\\d+)?$';

      this.editForm = this.formBuilder.group({
          id: [],
          prod_name: ['', Validators.required],
          prod_desc: ['', Validators.required],
          prod_price: ['', [
              Validators.required,
              Validators.pattern(numericPattern)
          ]]
      });


      this.rest.getProduct(this.id).subscribe((data: {}) => {
      console.log('getProduct');
      this.productData = data;
      console.log(this.productData);
      this.editForm.setValue(this.productData);
    });

  }

  // not used
  isInvalid(name: string) {
        const control = this.editForm.get(name);
        return control.invalid && control.dirty;
    }

    // convenience getter for easy access to form fields
    get f() { return this.editForm.controls; }

    onSubmit() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.editForm.invalid) {
            return;
        }

        this.rest.updateProduct(this.id, this.editForm.value);
          this.rest.updateProduct(this.id, this.editForm.value).subscribe((result) => {
              this.router.navigate(['']);
          }, (err) => {
            console.log(err);
          });
    }

    onCancel() {
        this.router.navigate(['']);
    }


}
