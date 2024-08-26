import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { pendingChangesGuard } from './guards/pending-changes.guard';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./components/product-list/product-list.component')
          .then(m => m.ProductListComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./components/product-form/product-form.component')
          .then(m => m.ProductFormComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./components/product-form/product-form.component')
          .then(m => m.ProductFormComponent),
        canDeactivate: [pendingChangesGuard]
      },
      {
        path: ':id/detail',
        loadComponent: () => import('./components/product-detail/product-detail.component')
          .then(m => m.ProductDetailComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
