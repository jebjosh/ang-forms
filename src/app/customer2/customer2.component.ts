import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidatorFn,
  FormArray,
} from '@angular/forms';
import { Customer } from '../customer/customer';
import { debounceTime } from 'rxjs';

function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (
      c.value !== null &&
      (isNaN(c.value) || c.value < min || c.value > max)
    ) {
      return { range: true };
    }

    return null;
  };
}

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');

  if (emailControl.pristine || confirmEmailControl.pristine) {
    return null;
  }

  if (emailControl.value === confirmEmailControl.value) {
    return null;
  }
  return { match: true };
}

@Component({
  selector: 'app-customer2',
  templateUrl: './customer2.component.html',
  styleUrls: ['./customer2.component.css'],
})
export class Customer2Component implements OnInit {
  customerForm!: FormGroup;

  user = 'admin';

  emailMessage = '';

  get addresses(): FormArray {
    return <FormArray>this.customerForm.get('addresses');
  }

  private validationMessages: any = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.',
  };

  customer: Customer = new Customer();
  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName: '',
      lastName: '', //{ value: 'n/a', disabled: this.user == 'admin' ? true : false },

      emailGroup: this.fb.group(
        {
          email: ['', [Validators.required, Validators.email]],
          confirmEmail: ['', [Validators.required, Validators.email]],
        },
        { validator: emailMatcher }
      ),

      sendCatalog: true,
      phone: '',
      notification: { value: 'email', name: 'age' },
      rating: [null, ratingRange(1, 5)],

      addresses: this.fb.array([this.buildAddress()]),
    });

    this.customerForm.get('notification').valueChanges.subscribe((value) => {
      this.setNotification(value);
    });

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.setMessage(emailControl);
    });
  }

  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      zip: '',
    });
  }
  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors)
        .map((key) => this.validationMessages[key])
        .join(' ');
    }
    console.log(c);
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  populateTestData() {
    this.customerForm.patchValue({
      firstName: 'Jack',
      lastName: 'Dan',
      email: 'jd@email.com',
    });
  }

  constructor(private fb: FormBuilder) {}

  setNotification(notifyVia: string) {
    const phoneControl = this.customerForm.get('phone');

    if (notifyVia === 'text') {
      phoneControl.setValidators([
        Validators.required,
        Validators.minLength(2),
      ]);
    } else {
      phoneControl.clearValidators();
      this.customerForm.get('phone').disabled;
    }

    phoneControl.updateValueAndValidity();

    // console.log(this.customerForm.get('notification').value['name']);
  }
}
