import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@shared/shared.module";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [ RouterModule, SharedModule ],
  template: `
    <app-header />
    <router-outlet></router-outlet>
  `,
})
export class ProductComponent { }
