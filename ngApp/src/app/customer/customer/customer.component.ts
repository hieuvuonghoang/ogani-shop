import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  constructor(
    private categoryService: CategoryService,
    private shareDataService: ShareDataService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    //Load data categories
    this.loadDataCategories();
    this.shareDataService.categoriesSource.subscribe(
      data => {
        // console.log(data);
      }
    )
    this.shareDataService.loggedIn.next(this.authService.loggedIn() ? "Y" : "N");
  }

  private loadDataCategories() {
    this.categoryService.getCategories().subscribe(
      data => {
        this.shareDataService.categoriesSource.next(JSON.stringify(data));
      }
    )
  }

}
