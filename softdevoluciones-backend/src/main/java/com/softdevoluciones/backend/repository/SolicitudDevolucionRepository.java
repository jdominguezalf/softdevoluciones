package com.softdevoluciones.backend.repository;

import com.softdevoluciones.backend.entity.SolicitudDevolucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface SolicitudDevolucionRepository
        extends JpaRepository<SolicitudDevolucion, Long>,
        JpaSpecificationExecutor<SolicitudDevolucion> {

    List<SolicitudDevolucion>
    findByUsuarioIdOrderByFechaSolicitudDesc(Long usuarioId);

    Optional<SolicitudDevolucion>
    findByIdAndUsuarioId(
            Long id,
            Long usuarioId
    );
}