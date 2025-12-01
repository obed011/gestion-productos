import { Routes } from '@angular/router';
import { FormularioProductosComponent } from './components/formulario-productos/formulario-productos.component';
import { ListarProductosComponent } from './components/listar-productos/listar-productos.component';

export const routes: Routes = [
    { path: '', component: ListarProductosComponent, title: 'Listado de Productos' },
  { path: 'crear', component: FormularioProductosComponent, title: 'Crear Producto' },
  { path: 'editar/:id', component: FormularioProductosComponent, title: 'Editar Producto' },
  { path: '**', redirectTo: '' }
];
