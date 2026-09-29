package com.softdevoluciones.backend.repository;

import com.softdevoluciones.backend.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompraRepository extends JpaRepository<Compra, Long> {

    List<Compra> findByUsuarioId(Long usuarioId);

    Optional<Compra> findByIdAndUsuarioId(Long id, Long usuarioId);
}