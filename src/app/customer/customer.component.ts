import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormArray,
} from '@angular/forms';
import { Customer } from './customer';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  customer = new Customer();
  constructor() {}

  ngOnInit() {}

  save(customerForm: NgForm) {
    console.log(customerForm.form);
    console.log('Saved: ' + JSON.stringify(customerForm.value));
  }
}
