package sv.gob.cnr.gestionproductos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sv.gob.cnr.gestionproductos.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface ProductoRepository extends JpaRepository<Producto , Long> {
    // Método para buscar productos por nombre con paginación
    Page<Producto> findByNombreContainingIgnoreCase(String nombre, Pageable pageable);
}
