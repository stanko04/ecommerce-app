import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';

import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AboutMeComponent } from './components/about-me/about-me.component';

const routes: Routes = [
  {path: 'about', component: AboutMeComponent },
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  // route for view product details
  {path: 'products/:id', component: ProductDetailsComponent},
  // route for search by keyword
  {path: 'search/:keyword', component: ProductListComponent},
  // route for show product by category id
  {path: 'category/:id', component: ProductListComponent},
  // show by default category id
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  // when no path is given
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  // else case
  {path: '**', redirectTo:'/products', pathMatch:'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    AboutMeComponent
  ],
  imports: [
    // router based on our routes
    RouterModule.forRoot(routes),
    // router outlet for updates section
    RouterModule,
    BrowserModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
