import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BreadCrumb } from '../models/bread-crumb';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

  categoriesSource!: BehaviorSubject<string>;
  loggedIn!: BehaviorSubject<string>;
  breadcrumbSource!: BehaviorSubject<BreadCrumb>;

  constructor() {
    this.categoriesSource = new BehaviorSubject("");
    this.loggedIn = new BehaviorSubject("N");
    this.breadcrumbSource = new BehaviorSubject(new BreadCrumb());
  }

}
