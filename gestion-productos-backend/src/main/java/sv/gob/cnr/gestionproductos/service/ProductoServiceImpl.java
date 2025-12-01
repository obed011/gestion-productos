package sv.gob.cnr.gestionproductos.service;

import sv.gob.cnr.gestionproductos.dto.ProductoDTO;
import sv.gob.cnr.gestionproductos.model.Producto;
import sv.gob.cnr.gestionproductos.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductoServiceImpl implements ProductoService {
    private final ProductoRepository productoRepository;

    // Crear un nuevo producto
    @Override
    @Transactional
    public ProductoDTO crear(ProductoDTO productoDTO) {
        Producto producto = mapToEntity(productoDTO);
        Producto guardado = productoRepository.save(producto);
        return mapToDTO(guardado);
    }

    // Listar productos con paginación y filtro por nombre
    @Override
    @Transactional(readOnly = true)
    public Page<ProductoDTO> listar(String nombre, Pageable pageable) {
        Page<Producto> productos;

        if (nombre != null && !nombre.trim().isEmpty()) {
            productos = productoRepository.findByNombreContainingIgnoreCase(nombre, pageable);
        } else {
            productos = productoRepository.findAll(pageable);
        }

        return productos.map(this::mapToDTO);
    }

    // Obtener un producto por ID
    @Override
    @Transactional(readOnly = true)
    public ProductoDTO obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        return mapToDTO(producto);
    }

    // Actualizar un producto existente
    @Override
    @Transactional
    public ProductoDTO actualizar(Long id, ProductoDTO productoDTO) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        producto.setStock(productoDTO.getStock());

        Producto actualizado = productoRepository.save(producto);
        return mapToDTO(actualizado);
    }

    // Eliminar un producto por ID
    @Override
    @Transactional
    public void eliminar(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado con ID: " + id);
        }
        productoRepository.deleteById(id);
    }

    // Mapeo entre entidad y DTO
    private ProductoDTO mapToDTO(Producto producto) {
        return new ProductoDTO(
                producto.getId(),
                producto.getNombre(),
                producto.getDescripcion(),
                producto.getPrecio(),
                producto.getStock(),
                producto.getFechaCreacion()
        );
    }

    // Mapeo entre DTO y entidad
    private Producto mapToEntity(ProductoDTO dto) {
        Producto producto = new Producto();
        producto.setId(dto.getId());
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setFechaCreacion(dto.getFechaCreacion());
        return producto;
    }
}
