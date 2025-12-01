package sv.gob.cnr.gestionproductos.service;

import sv.gob.cnr.gestionproductos.dto.ProductoDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

// Servicio para la gestión de productos
public interface ProductoService {
    ProductoDTO crear(ProductoDTO productoDTO);
    Page<ProductoDTO> listar(String nombre, Pageable pageable);
    ProductoDTO obtenerPorId(Long id);
    ProductoDTO actualizar(Long id, ProductoDTO productoDTO);
    void eliminar(Long id);
}
