import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-productos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './listar-productos.component.html',
  styleUrl: './listar-productos.component.css'
})
export class ListarProductosComponent implements OnInit {
  productos: Producto[] = [];
  nombreBusqueda: string = '';

  // Paginación
  paginaActual: number = 0;
  totalPaginas: number = 0;
  totalElementos: number = 0;
  elementosPorPagina: number = 10;

  // Spinner de carga
  cargando: boolean = false;

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    this.cargarProductos();
  }

  // Cargar productos con paginación y búsqueda
  cargarProductos(): void {
    // Activar spinner al iniciar la carga
    this.cargando = true;

    this.productoService.listar(this.nombreBusqueda, this.paginaActual, this.elementosPorPagina)
      .subscribe({
        next: (response) => {
          this.productos = response.content;
          this.totalPaginas = response.totalPages;
          this.totalElementos = response.totalElements;

          // Desactivar spinner al completar la carga
          this.cargando = false;
        },
        error: (error) => {
          // Desactivar spinner en caso de error
          this.cargando = false;

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los productos',
            confirmButtonColor: '#ffc107'
          });
        }
      });
  }

  // Buscar productos por nombre
  buscar(): void {
    this.paginaActual = 0;
    this.cargarProductos();
  }

  // Cambiar página
  cambiarPagina(pagina: number): void {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaActual = pagina;
      this.cargarProductos();
    }
  }

  // Eliminar producto con confirmación
  eliminar(id: number, nombre: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el producto "${nombre}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productoService.eliminar(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'Producto eliminado exitosamente',
              timer: 2000,
              showConfirmButton: false
            });
            this.cargarProductos();
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el producto',
              confirmButtonColor: '#ffc107'
            });
          }
        });
      }
    });
  }

  // Rango de elementos mostrados
  get mostrandoDesde(): number {
    return this.totalElementos === 0 ? 0 : this.paginaActual * this.elementosPorPagina + 1;
  }

  // Rango de elementos mostrados
  get mostrandoHasta(): number {
    const hasta = (this.paginaActual + 1) * this.elementosPorPagina;
    return hasta > this.totalElementos ? this.totalElementos : hasta;
  }

  // Control de filas expandidas
  expandidos: Set<number> = new Set();

  // Alternar expansión de fila
  toggleExpand(id: number): void {
    if (this.expandidos.has(id)) {
      this.expandidos.delete(id);
    } else {
      this.expandidos.add(id);
    }
  }

  // Verificar si la fila está expandida
  estaExpandido(id: number): boolean {
    return this.expandidos.has(id);
  }
}