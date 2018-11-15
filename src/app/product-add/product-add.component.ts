import { Component, OnInit, Input , Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../rest.service';
import swal from 'sweetalert2';

const toast = swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timer: 3000
});

const swalWithBootstrapButtons = swal.mixin({
    confirmButtonClass: 'btn btn-success',
    cancelButtonClass: 'btn btn-danger',
    buttonsStyling: false,
});


@Component({
    selector: 'ngbd-modal-content',
    template: `
        <div class="modal-header">
            <h4 class="modal-title">{{modalTitle}}</h4>
            <button type="button" class="close" (click)="activeModal.dismiss('Cross click')">
                <span>&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <p>{{modalBody}}</p>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
            <button type="button" class="btn btn-primary" (click)="doSomething()">Do Something</button>
        </div>
  `
})

export class NgbdModalContent {
    @Input() modalTitle;
    @Input() modalBody;
    constructor(public activeModal: NgbActiveModal) {}
    doSomething() {
        console.log('doSomething');
        this.activeModal.dismiss('Do Something click');
    }


}

@Component({
    selector: 'app-product-add',
    templateUrl: './product-add.component.html',
    styleUrls: ['./product-add.component.css']
})

export class ProductAddComponent implements OnInit {

    addForm: FormGroup;
    submitted = false;





    constructor(private formBuilder: FormBuilder, public rest: RestService, private route: ActivatedRoute, private router: Router,  private modalService: NgbModal) { }

    ngOnInit() {

        const  numericPattern = '^[1-9]\\d*(\\.\\d+)?$';

        this.addForm = this.formBuilder.group({
          id: [],
          prod_name: ['', Validators.required],
          prod_desc: ['', Validators.required],
          prod_price: ['', [
              Validators.required,
              Validators.pattern(numericPattern)
              ]
          ]
      });




    }

    // not used
    isInvalid(name: string) {

          const control = this.addForm.get(name);
          return control.invalid && control.dirty;

      }

    // convenience getter for easy access to form fields
    get f() { return this.addForm.controls; }


    onSubmit() {

        this.submitted = true;

      // stop here if form is invalid
        if (this.addForm.invalid) {
            return;
        }


        this.rest.addProduct(this.addForm.value).subscribe((result) => {
              console.log('addProduct');
              console.log(result);

              this.router.navigate(['']);

          }, (err) => {
              console.log(err);
          });

      }

      onCancel() {
          this.router.navigate(['']);
      }


    openModal() {
        const modalRef = this.modalService.open(NgbdModalContent);
        modalRef.componentInstance.modalTitle = 'Product Add';
        modalRef.componentInstance.modalBody = 'Successful';
    }


    msgSuccess(title: string, message: string) {
        swal({
            title: title,
            text: message,
            type: 'success',
            confirmButtonText: 'Ok',
            allowOutsideClick: false
        }).catch(swal.noop);
    }

    // showToast(title: string) {
    //     toast({
    //         type: 'success',
    //         title: title
    //     })
    // }

    showToast(type: any, title: string) {
        toast({
            type: type,
            title: title
        })
    }


    openBasicSwal() {
        swal({
            title: 'Heres a message!',
            text: 'Its pretty, isnt it?'
        }).catch(swal.noop);
    }

    openSuccessSwal() {
        swal({
            title: 'Good job!',
            text: 'You clicked the button!',
            type: 'success'
        }).catch(swal.noop);
    }

    openConfirmsSwal() {
        swal({
            title: 'Are you sure?',
            text: 'You wont be able to revert',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(function () {
            swal(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            );
        }).catch(swal.noop);
    }

    openSuccessCancelSwal() {
        swal({
            title: 'Are you sure?',
            text: 'You wont be able to revert',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            confirmButtonClass: 'btn btn-success m-r-10',
            cancelButtonClass: 'btn btn-danger',
            buttonsStyling: false
        }).then(function () {
            swal(
                'Deleted!',
                'Your file has been deleted.',
                'success'
            );
        }, function (dismiss) {
            if (dismiss === 'cancel') {
                swal(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                );
            }
        }).catch(swal.noop);
    }

    openPromptSwal() {
        swal.setDefaults({
            input: 'text',
            confirmButtonText: 'Next &rarr;',
            showCancelButton: true,
            animation: false,
            progressSteps: ['1', '2', '3']
        });

        const steps = [
            {
                title: 'Question 1',
                text: 'Chaining swal2 modals is easy'
            },
            'Question 2',
            'Question 3'
        ];

        swal.queue(steps).then(function (result) {
            swal.resetDefaults();
            swal({
                title: 'All done!',
                html:
                    'Your answers: <pre>' +
                    JSON.stringify(result) +
                    '</pre>',
                confirmButtonText: 'Lovely!',
                showCancelButton: false
            });
        }, function () {
            swal.resetDefaults();
        }).catch(swal.noop);
    }

    openAjaxSwal() {
        swal({
            title: 'Submit email to run ajax request',
            input: 'email',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: function (email) {
                return new Promise(function (resolve, reject) {
                    setTimeout(function() {
                        if (email === 'taken@example.com') {
                            reject('This email is already taken.');
                        } else {
                            resolve();
                        }
                    }, 2000);
                });
            },
            allowOutsideClick: false
        }).then(function (email) {
            swal({
                type: 'success',
                title: 'Ajax request finished!',
                html: 'Submitted email: ' + email
            });
        }).catch(swal.noop);
    }




}
