import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isProductsView: boolean = true;
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isProductsView = true;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => event as NavigationEnd),
    ).subscribe((event) => {
      this.isProductsView = event.url.toString() == '/products';
    });

    if (this.router.url != '/products') {
      this.isProductsView = false;
    }
  }
}
