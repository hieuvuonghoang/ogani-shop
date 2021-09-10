import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BreadCrumb } from '../models/bread-crumb';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  categoriesSource!: BehaviorSubject<string>;
  //N: Logout; Y: Login
  loggedIn!: BehaviorSubject<string>;
  breadcrumbSource!: BehaviorSubject<BreadCrumb>;
  //EMPTY: ;W: Wait; C: Complete
  stateRequestSource!: BehaviorSubject<string>;

  constructor() {
    this.categoriesSource = new BehaviorSubject("");
    this.loggedIn = new BehaviorSubject("N");
    this.breadcrumbSource = new BehaviorSubject(new BreadCrumb());
    this.stateRequestSource = new BehaviorSubject("");
  }

}
