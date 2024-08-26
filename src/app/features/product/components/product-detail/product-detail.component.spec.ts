import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductDetailComponent } from './product-detail.component';
import { ProductsService } from '../../services/products.service';
import { Product } from '@features/product/models/product.model';
import { SnackBarService } from '../../../../shared/services/snack-bar.service';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let productsService: ProductsService;
  let route: ActivatedRoute;
  let snackBarService: SnackBarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ProductDetailComponent],
      providers: [
        ProductsService,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
        SnackBarService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    productsService = TestBed.inject(ProductsService);
    route = TestBed.inject(ActivatedRoute);
    snackBarService = TestBed.inject(SnackBarService);
    fixture.detectChanges();
  });

  it('should fetch product information on initialization', () => {
    spyOn(route.snapshot.paramMap, 'get').and.returnValue('1');
    spyOn(productsService, 'getProduct').and.returnValue(of({ id: 1, name: 'Product 1', description: 'Description', price: 10, createdAt: new Date('2022-01-01'), updatedAt: new Date('2022-01-01') }));

    component.ngOnInit();

    expect(productsService.getProduct).toHaveBeenCalledWith(1);
    expect(component.loading).toBeFalse();
    expect(component.product).toEqual({ id: 1, name: 'Product 1', description: 'Description', price: 10, createdAt: new Date(), updatedAt: new Date() });
  });
});
