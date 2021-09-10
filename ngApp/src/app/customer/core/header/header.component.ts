import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { ShareDataService } from '../../../services/share-data.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  categories: Category[] = [];
  catetory!: Category;
  loggedIn: boolean = false;

  constructor(
    private shareDataService: ShareDataService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    // this.loggedIn = this.authService.loggedIn();
    this.shareDataService.categoriesSource.subscribe(
      data => {
        if (data !== "") {
          this.categories = JSON.parse(data);
          if (this.categories.length != 0) {
            this.catetory = this.categories[0];
          }
        }
      }
    );
    this.shareDataService.loggedIn.subscribe(
      data => {
        if(data == "Y") {
          this.loggedIn = true;
        } else {
          this.loggedIn = false;
        }
      }
    )
  }

  toggleCategories() {
    $('.hero__categories ul').slideToggle(400);
  }

  onSelectCategory(_id: string) {
    this.catetory = (this.categories.find(category => category._id === _id))!;
    this.toggleCategories();
    this.router.navigate(['product-list', this.catetory._id]);
  }

  logout() {
    this.authService.logOutUser();
    this.shareDataService.loggedIn.next('N');
  }

}
