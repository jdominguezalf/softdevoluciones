package com.softdevoluciones.backend.service;

import com.softdevoluciones.backend.dto.CrearDevolucionRequest;
import com.softdevoluciones.backend.dto.DetalleDevolucionRequest;
import com.softdevoluciones.backend.dto.DetalleDevolucionResponse;
import com.softdevoluciones.backend.dto.SolicitudDevolucionResponse;
import com.softdevoluciones.backend.entity.Compra;
import com.softdevoluciones.backend.entity.DetalleCompra;
import com.softdevoluciones.backend.entity.DetalleDevolucion;
import com.softdevoluciones.backend.entity.EstadoDevolucion;
import com.softdevoluciones.backend.entity.SolicitudDevolucion;
import com.softdevoluciones.backend.exception.RecursoNoEncontradoException;
import com.softdevoluciones.backend.exception.ReglaNegocioException;
import com.softdevoluciones.backend.repository.CompraRepository;
import com.softdevoluciones.backend.repository.DetalleCompraRepository;
import com.softdevoluciones.backend.repository.DetalleDevolucionRepository;
import com.softdevoluciones.backend.repository.SolicitudDevolucionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SolicitudDevolucionService {

    private final CompraRepository compraRepository;
    private final DetalleCompraRepository detalleCompraRepository;
    private final SolicitudDevolucionRepository solicitudRepository;
    private final DetalleDevolucionRepository detalleDevolucionRepository;

    @Transactional
    public SolicitudDevolucionResponse crearSolicitud(
            Long usuarioId,
            CrearDevolucionRequest request
    ) {

        Compra compra = compraRepository
                .findByIdAndUsuarioId(request.getCompraId(), usuarioId)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "La compra no existe o no pertenece al usuario"
                        )
                );

        SolicitudDevolucion solicitud = SolicitudDevolucion.builder()
                .fechaSolicitud(LocalDateTime.now())
                .estado(EstadoDevolucion.SOLICITADA)
                .motivo(request.getMotivo())
                .comentario(request.getComentario())
                .importe(BigDecimal.ZERO)
                .compra(compra)
                .usuario(compra.getUsuario())
                .detalles(new ArrayList<>())
                .build();

        BigDecimal importeTotal = BigDecimal.ZERO;

        for (DetalleDevolucionRequest detalleRequest : request.getDetalles()) {

            DetalleCompra detalleCompra = detalleCompraRepository
                    .findByIdAndCompraId(
                            detalleRequest.getDetalleCompraId(),
                            compra.getId()
                    )
                    .orElseThrow(() ->
                            new RecursoNoEncontradoException(
                                    "El producto indicado no pertenece a la compra"
                            )
                    );

            Integer cantidadYaDevuelta =
                    detalleDevolucionRepository
                            .sumarCantidadDevueltaAprobada(detalleCompra.getId());

            if (cantidadYaDevuelta == null) {
                cantidadYaDevuelta = 0;
            }

            int cantidadDisponible =
                    detalleCompra.getCantidad() - cantidadYaDevuelta;

            if (detalleRequest.getCantidad() <= 0) {
                throw new ReglaNegocioException(
                        "La cantidad debe ser mayor que cero"
                );
            }

            if (detalleRequest.getCantidad() > cantidadDisponible) {
                throw new ReglaNegocioException(
                        "La cantidad solicitada supera la cantidad disponible para devolución"
                );
            }

            BigDecimal importeDetalle =
                    detalleCompra.getPrecioUnitario()
                            .multiply(
                                    BigDecimal.valueOf(
                                            detalleRequest.getCantidad()
                                    )
                            );

            DetalleDevolucion detalleDevolucion =
                    DetalleDevolucion.builder()
                            .cantidad(detalleRequest.getCantidad())
                            .importe(importeDetalle)
                            .solicitud(solicitud)
                            .detalleCompra(detalleCompra)
                            .build();

            solicitud.getDetalles().add(detalleDevolucion);

            importeTotal = importeTotal.add(importeDetalle);
        }

        solicitud.setImporte(importeTotal);

        SolicitudDevolucion guardada =
                solicitudRepository.save(solicitud);

        return mapearSolicitud(guardada);
    }

    @Transactional(readOnly = true)
    public List<SolicitudDevolucionResponse> listarPorUsuario(Long usuarioId) {

        return solicitudRepository
                .findByUsuarioIdOrderByFechaSolicitudDesc(usuarioId)
                .stream()
                .map(this::mapearSolicitud)
                .toList();
    }

    @Transactional(readOnly = true)
    public SolicitudDevolucionResponse obtenerPorUsuario(
            Long solicitudId,
            Long usuarioId
    ) {

        SolicitudDevolucion solicitud = solicitudRepository
                .findByIdAndUsuarioId(solicitudId, usuarioId)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Solicitud no encontrada o no pertenece al usuario"
                        )
                );

        return mapearSolicitud(solicitud);
    }

    private SolicitudDevolucionResponse mapearSolicitud(
            SolicitudDevolucion solicitud
    ) {

        List<DetalleDevolucionResponse> detalles =
                solicitud.getDetalles()
                        .stream()
                        .map(detalle ->
                                DetalleDevolucionResponse.builder()
                                        .id(detalle.getId())
                                        .detalleCompraId(
                                                detalle.getDetalleCompra().getId()
                                        )
                                        .productoNombre(
                                                detalle.getDetalleCompra()
                                                        .getProducto()
                                                        .getNombre()
                                        )
                                        .cantidad(detalle.getCantidad())
                                        .importe(detalle.getImporte())
                                        .build()
                        )
                        .toList();

        return SolicitudDevolucionResponse.builder()
                .id(solicitud.getId())
                .compraId(solicitud.getCompra().getId())
                .fechaSolicitud(solicitud.getFechaSolicitud())
                .estado(solicitud.getEstado())
                .motivo(solicitud.getMotivo())
                .comentario(solicitud.getComentario())
                .observacionOperador(solicitud.getObservacionOperador())
                .importe(solicitud.getImporte())
                .detalles(detalles)
                .build();
    }
}