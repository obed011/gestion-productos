import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario-productos',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './formulario-productos.component.html',
  styleUrl: './formulario-productos.component.css'
})
export class FormularioProductosComponent implements OnInit {
  producto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0
  };

  esEdicion: boolean = false;
  idProducto?: number;

  //Almacenar errores del backend
  erroresBackend: { [key: string]: string } = {};

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.idProducto = this.route.snapshot.params['id'];
    if (this.idProducto) {
      this.esEdicion = true;
      this.cargarProducto();
    }
  }
  // Cargar producto para edición
  cargarProducto(): void {
    this.productoService.obtenerPorId(this.idProducto!).subscribe({
      next: (producto) => {
        this.producto = producto;
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cargar el producto',
          confirmButtonColor: '#ffc107'
        });
        this.router.navigate(['/']);
      }
    });
  }

  // Guardar o actualizar producto
  guardar(): void {
    // Limpiar errores previos
    this.erroresBackend = {};

    if (this.esEdicion) {
      // Actualizar producto
      this.productoService.actualizar(this.idProducto!, this.producto).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Actualizado!',
            text: 'Producto actualizado exitosamente',
            timer: 2000,
            showConfirmButton: false
          });
          this.router.navigate(['/']);
        },
        error: (error) => {
          // Capturar errores del backend
          if (error.error?.errores) {
            // Si hay errores de validación específicos, guardarlos
            this.erroresBackend = error.error.errores;
          } else {
            // Si hay un error genérico (404, 500), mostrar SweetAlert
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.mensaje || 'No se pudo actualizar el producto',
              confirmButtonColor: '#ffc107'
            });
          }
        }
      });
    } else {
      // Crear nuevo producto
      this.productoService.crear(this.producto).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: '¡Guardado!',
            text: 'Producto creado exitosamente',
            timer: 2000,
            showConfirmButton: false
          });
          this.router.navigate(['/']);
        },
        error: (error) => {
          // Capturar errores del backend
          if (error.error?.errores) {
            // Si hay errores de validación específicos, guardarlos
            this.erroresBackend = error.error.errores;
          } else {
            // Si hay un error genérico (404, 500), mostrar SweetAlert
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error.error?.mensaje || 'No se pudo crear el producto',
              confirmButtonColor: '#ffc107'
            });
          }
        }
      });
    }
  }

  // Limpiar error específico al modificar el campo
  limpiarError(campo: string): void {
    if (this.erroresBackend[campo]) {
      delete this.erroresBackend[campo];
    }
  }
}