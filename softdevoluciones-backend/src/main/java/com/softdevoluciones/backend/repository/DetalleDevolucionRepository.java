package com.softdevoluciones.backend.repository;

import com.softdevoluciones.backend.entity.DetalleDevolucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DetalleDevolucionRepository
        extends JpaRepository<DetalleDevolucion, Long> {

    @Query("""
        SELECT COALESCE(SUM(d.cantidad), 0)
        FROM DetalleDevolucion d
        WHERE d.detalleCompra.id = :detalleCompraId
        AND d.solicitud.estado IN (
            com.softdevoluciones.backend.entity.EstadoDevolucion.APROBADA,
            com.softdevoluciones.backend.entity.EstadoDevolucion.COMPLETADA
        )
    """)
    Integer sumarCantidadDevueltaAprobada(
            @Param("detalleCompraId") Long detalleCompraId
    );
}