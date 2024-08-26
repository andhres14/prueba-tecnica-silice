import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { ProductsService } from './products.service';
import { TodoService } from '@utils/todo.service';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Product } from '../models/product.model';
import { SnackBarService } from '@shared/services/snack-bar.service';
import { inject } from '@angular/core';


describe('ProductService', () => {
  let service: ProductsService;
  let snackBarServiceSpy: jasmine.SpyObj<SnackBarService>;

  beforeEach(() => {
    snackBarServiceSpy = jasmine.createSpyObj('SnackBarService', ['showSnackBar']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        ProductsService,
        TodoService,
        { provide: SnackBarService, useValue: snackBarServiceSpy },
      ],
    });
    service = TestBed.inject(ProductsService);
  });

  it('Debería agregar un nuevo producto', fakeAsync(() => {
      const productToAdd: Product = {
        id: 111,
        name: 'Producto nuevo',
        description: 'Descripción',
        price: 10000,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      let isOk: boolean = false;
      service.addProduct(productToAdd).subscribe(result => isOk = result);
      tick(1000);
      expect(isOk).toBeTrue();
  }));

  it('Debería actualizar el producto existente', fakeAsync(() => {
    const existingProduct: Product = {
      id: 1009,
      name: 'Producto actualizado',
      description: 'Desc',
      price: 10000,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    let isUpdated: boolean = false;
    service.addProduct(existingProduct).subscribe();
    tick(1000);
    service.updateProduct(existingProduct).subscribe(result => isUpdated = result);
    tick(1000);
    expect(isUpdated).toBeTrue();
  }));

  it('Debería eliminar un producto existente', fakeAsync(() => {
    const productToDelete = {
      id: 290,
      name: 'Producto to Delete',
      description: 'Descripción delete',
      price: 10,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    let isEliminated: boolean = false;
    service.addProduct(productToDelete).subscribe();
    tick(1000);
    service.deleteProduct(productToDelete.id).subscribe(result => isEliminated = result);
    tick(1000);
    expect(isEliminated).toBeTrue();
  }));

  it('Debería obtener el listado de Productos', fakeAsync(() => {
    const productToAdd = {
      id: 29011,
      name: 'Producto to Add',
      description: 'Descripción Added',
      price: 1011111,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    service.addProduct(productToAdd).subscribe();
    tick(1000);
    service.getProducts().subscribe(result => {
      expect(result.length).toBeGreaterThan(0);
    });
  }));


});

describe('TodoService [Mock API External]', () => {
  let todoService: TodoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodoService],
    });
    todoService = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debería retornar el item con ID 1 del API de JsonPlaceHolder', () => {
    const mockTodo = {
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false,
    };

    todoService.getTodoById(1).subscribe(todo => {
      expect(todo).toEqual(mockTodo);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTodo);
  });
});
