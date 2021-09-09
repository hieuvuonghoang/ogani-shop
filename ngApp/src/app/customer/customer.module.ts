import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer/customer.component';

import { HeaderComponent } from './core/header/header.component';
import { BreadCrumbComponent } from './core/bread-crumb/bread-crumb.component';
import { FooterComponent } from './core/footer/footer.component';
import { ShopComponent } from './shop/shop/shop.component';
import { ProductListComponent } from './shop/product-list/product-list.component';

@NgModule({
  declarations: [
    HeaderComponent,
    BreadCrumbComponent,
    FooterComponent,
    ShopComponent,
    ProductListComponent,
    CustomerComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
  ]
})
export class CustomerModule { }
