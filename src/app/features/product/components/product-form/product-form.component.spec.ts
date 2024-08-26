import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ProductFormComponent } from './product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ProductFormComponent,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => '1' // Simula un ID de producto
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('Debería marcar el campo [Nombre] como invalido cuando este vacío', () => {
    const nameControl = component.formProduct.get('name');
    nameControl?.setValue('');
    expect(nameControl?.hasError('required')).toBeTrue();
  });

  it('Debería marcar el campo [Nombre] como invalido cuando haya menos de 3 caracteres', () => {
    const nameControl = component.formProduct.get('name');
    nameControl?.setValue('nu');
    expect(nameControl?.hasError('minlength')).toBeTrue();
  });

  it('Debería marcar el campo [Precio] como invalido cuando este vacío', () => {
    const priceControl = component.formProduct.get('price');
    priceControl?.setValue('');
    expect(priceControl?.hasError('required')).toBeTrue();
  });

  it('Debería marcar el campo [Precio] como invalido cuando el precio es menor a 1', () => {
    const priceControl = component.formProduct.get('price');
    priceControl?.setValue(0);
    expect(priceControl?.hasError('min')).toBeTrue();
  });

  it('Debería inicializar el formulario con la info del producto en modo edición', () => {
    component.isCreationMode = false;
    component._id = 1;
    component.product = {
      id: 1,
      name: 'Existing Product',
      description: 'Product description',
      price: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    component.formProduct.get('name')?.setValue('Existing Product');
    component.formProduct.get('description')?.setValue('Product description');
    component.formProduct.get('price')?.setValue(100);


    fixture.detectChanges();

    expect(component.formProduct.get('name')?.value).toBe('Existing Product');
    expect(component.formProduct.get('description')?.value).toBe('Product description');
    expect(component.formProduct.get('price')?.value).toBe(100);
  });

  it('Debería marcar el formulario como invalido cuando no se cumplen algunas de las validaciones', () => {
    component.formProduct.get('name')?.setValue('');
    component.formProduct.get('price')?.setValue(0);
    fixture.detectChanges();

    expect(component.formProduct.invalid).toBeTrue();
  });


});
