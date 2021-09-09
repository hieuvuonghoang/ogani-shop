import { Component, OnInit } from '@angular/core';
import { BreadCrumb } from 'src/app/models/bread-crumb';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.css']
})
export class BreadCrumbComponent implements OnInit {

  breadCrumb!: BreadCrumb;

  constructor(
    private shareData: ShareDataService,
  ) { }

  ngOnInit(): void {
    this.shareData.breadcrumbSource.subscribe(
      data => {
        this.breadCrumb = data;
      }
    );
  }

}
