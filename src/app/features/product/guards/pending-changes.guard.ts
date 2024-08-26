import { ProductFormComponent } from '../components/product-form/product-form.component';

export const pendingChangesGuard = ( (component: ProductFormComponent) => {
  const isDirty = component.isDirty();
  let shouldNavigate = true;
  if (isDirty) {
    return window.confirm('¿Segur@ que desea salir? Los cambios no se guardarán.');
  }
  return shouldNavigate;
});
