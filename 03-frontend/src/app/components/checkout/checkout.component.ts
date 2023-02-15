import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { DatesFormService } from 'src/app/services/dates-form.service';
import { MyOwnValidators } from 'src/app/validators/my-own-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  country1: Country = new Country("Slovensko");
  country2: Country = new Country("Česká republika");
  country3: Country = new Country("Maďarsko");
  country4: Country = new Country("Poľsko");
  countries: string[] = ["Slovensko", "Česká republika", "Maďarsko", "Poľsko", "Rakúsko"];

  constructor(private formBuilder: FormBuilder, private DatesFormService: DatesFormService, private cartService: CartService, private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), MyOwnValidators.notOnlyWhitespace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), MyOwnValidators.notOnlyWhitespace]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAdress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), MyOwnValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), MyOwnValidators.notOnlyWhitespace]),
        //state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), MyOwnValidators.notOnlyWhitespace])
      }),
      billingAdress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), MyOwnValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), MyOwnValidators.notOnlyWhitespace]),
        //state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), MyOwnValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:new FormControl('', [Validators.required, Validators.minLength(2), MyOwnValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required])
      })
    });

    // populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth:" + startMonth);

    this.DatesFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;

      }
    );

    // populate credit card years
    this.DatesFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

  }

  reviewCartDetails() {

    // subscribe to cartService.totalQuantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );

    // subscribe to cartService.totalPrice
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );

  }

  onSubmit() {
    console.log("HAndling the submit button");

    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //console.log(this.checkoutFormGroup.get('customer').value);
    //console.log("The email adress is: " + this.checkoutFormGroup.get('customer').value.email);
    //console.log("The shipping adress country is " + this.checkoutFormGroup.get);

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // - long way
    let orderItems: OrderItem[] = [];
    for(let i = 0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping adress
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAdress'].value;
    ///const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingAdressCountry: /*Country*/ string = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.country = shippingAdressCountry;//.name;

    // populate purchase - billing adress
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAdress'].value;
    ///const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const billingAdressCountry: string = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.country = billingAdressCountry;

    // populate purchase -  order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Vaša objednávka bola zaznamenaná.\nTracking číslo vašej objednávky: ${response.orderTrackingNumber}`);

          // reset cart
          this.resetCart();
        },
        error: err => {
          alert(`Vyskytla sa chyba: ${err.message}`);
        }

      }
    );
  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the form data
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAdressStreet() { return this.checkoutFormGroup.get('shippingAdress.street'); }
  get shippingAdressCity() { return this.checkoutFormGroup.get('shippingAdress.city'); }
  //get shippingAdressState() { return this.checkoutFormGroup.get('shippingAdress.state'); }
  get shippingAdressCountry() { return this.checkoutFormGroup.get('shippingAdress.country'); }
  get shippingAdressZipCode() { return this.checkoutFormGroup.get('shippingAdress.zipCode'); }

  get billingAdressStreet() { return this.checkoutFormGroup.get('billingAdress.street'); }
  get billingAdressCity() { return this.checkoutFormGroup.get('billingAdress.city'); }
  //get billingAdressState() { return this.checkoutFormGroup.get('billingAdress.state'); }
  get billingAdressCountry() { return this.checkoutFormGroup.get('billingAdress.country'); }
  get billingAdressZipCode() { return this.checkoutFormGroup.get('billingAdress.zipCode'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpirationMonth() { return this.checkoutFormGroup.get('creditCard.expirationMonth'); }
  get creditCardExpirationYear() { return this.checkoutFormGroup.get('creditCard.expirationYear'); }



  copyShippingAddressToBillingAddress(event) {
    if(event.target.checked) {
      this.checkoutFormGroup.controls['billingAdress'].setValue(this.checkoutFormGroup.controls['shippingAdress'].value);


    }
    else{
      this.checkoutFormGroup.controls['billingAdress'].reset();
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // if the current year eqauls the selected year, then start with the current month
    let startMonth: number;

    if(currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.DatesFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }

}
