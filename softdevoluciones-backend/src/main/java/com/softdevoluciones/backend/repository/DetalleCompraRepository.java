package com.softdevoluciones.backend.repository;

import com.softdevoluciones.backend.entity.DetalleCompra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DetalleCompraRepository extends JpaRepository<DetalleCompra, Long> {

    List<DetalleCompra> findByCompraId(Long compraId);

    Optional<DetalleCompra> findByIdAndCompraId(Long id, Long compraId);
}