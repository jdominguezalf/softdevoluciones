package com.softdevoluciones.backend.service;

import com.softdevoluciones.backend.dto.CompraResponse;
import com.softdevoluciones.backend.dto.DetalleCompraResponse;
import com.softdevoluciones.backend.entity.Compra;
import com.softdevoluciones.backend.exception.RecursoNoEncontradoException;
import com.softdevoluciones.backend.repository.CompraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompraService {

    private final CompraRepository compraRepository;

    @Transactional(readOnly = true)
    public List<CompraResponse> listarComprasUsuario(Long usuarioId) {

        return compraRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(this::mapearCompra)
                .toList();
    }

    @Transactional(readOnly = true)
    public CompraResponse obtenerCompraUsuario(Long compraId, Long usuarioId) {

        Compra compra = compraRepository
                .findByIdAndUsuarioId(compraId, usuarioId)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Compra no encontrada o no pertenece al usuario"
                        )
                );

        return mapearCompra(compra);
    }

    private CompraResponse mapearCompra(Compra compra) {

        List<DetalleCompraResponse> detalles = compra.getDetalles()
                .stream()
                .map(detalle -> {

                    BigDecimal subtotal = detalle.getPrecioUnitario()
                            .multiply(BigDecimal.valueOf(detalle.getCantidad()));

                    return DetalleCompraResponse.builder()
                            .id(detalle.getId())
                            .productoId(detalle.getProducto().getId())
                            .productoNombre(detalle.getProducto().getNombre())
                            .productoDescripcion(detalle.getProducto().getDescripcion())
                            .cantidad(detalle.getCantidad())
                            .precioUnitario(detalle.getPrecioUnitario())
                            .subtotal(subtotal)
                            .build();
                })
                .toList();

        return CompraResponse.builder()
                .id(compra.getId())
                .fecha(compra.getFecha())
                .total(compra.getTotal())
                .estado(compra.getEstado())
                .detalles(detalles)
                .build();
    }
    @Transactional(readOnly = true)
    public List<CompraResponse> listarTodasLasCompras() {

        return compraRepository
                .findAll()
                .stream()
                .map(this::mapearCompra)
                .toList();
    }

    @Transactional(readOnly = true)
    public CompraResponse obtenerCompraPorId(Long compraId) {

        Compra compra = compraRepository
                .findById(compraId)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Compra no encontrada"
                        )
                );

        return mapearCompra(compra);
    }
}