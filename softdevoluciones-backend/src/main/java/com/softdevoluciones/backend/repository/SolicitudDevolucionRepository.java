package com.softdevoluciones.backend.repository;

import com.softdevoluciones.backend.entity.EstadoDevolucion;
import com.softdevoluciones.backend.entity.MotivoDevolucion;
import com.softdevoluciones.backend.entity.SolicitudDevolucion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SolicitudDevolucionRepository
        extends JpaRepository<SolicitudDevolucion, Long> {

    List<SolicitudDevolucion> findByUsuarioIdOrderByFechaSolicitudDesc(Long usuarioId);

    Optional<SolicitudDevolucion> findByIdAndUsuarioId(Long id, Long usuarioId);

    Page<SolicitudDevolucion> findByEstado(
            EstadoDevolucion estado,
            Pageable pageable
    );

    Page<SolicitudDevolucion> findByMotivo(
            MotivoDevolucion motivo,
            Pageable pageable
    );

    Page<SolicitudDevolucion> findByFechaSolicitudBetween(
            LocalDateTime desde,
            LocalDateTime hasta,
            Pageable pageable
    );
}