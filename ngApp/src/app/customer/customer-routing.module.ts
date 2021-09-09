import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShopComponent } from './shop/shop/shop.component';
import { CustomerComponent } from './customer/customer.component';
import { ProductListComponent } from './shop/product-list/product-list.component';
import { ProductDetailComponent } from './shop/product-detail/product-detail.component';
import { ProductCartComponent } from './shop/product-cart/product-cart.component';
import { ProductCheckOutComponent } from './shop/product-check-out/product-check-out.component';

import { ProductListResolverService } from '../services/resolver/product-list-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    children: [
      {
        path: '',
        component: ShopComponent,
        children: [
          {
            path: 'product-list',
            component: ProductListComponent,
            resolve: {
              obj: ProductListResolverService
            },
            data: {
              animation: 'product-list'
            },
          },
          {
            path: 'product-list/:id',
            component: ProductListComponent,
            resolve: {
              obj: ProductListResolverService
            },
            data: {
              animation: 'product-list'
            },
          },
          {
            path: 'product-detail',
            component: ProductDetailComponent,
          },
          {
            path: 'product-cart',
            component: ProductCartComponent,
          },
          {
            path: 'product-checkout',
            component: ProductCheckOutComponent,
          },
          {
            path: '',
            component: ProductListComponent,
            resolve: {
              obj: ProductListResolverService
            },
            data: {
              animation: 'product-list'
            },
          },
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
