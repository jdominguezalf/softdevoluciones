package com.softdevoluciones.backend.service;

import com.softdevoluciones.backend.dto.CambiarEstadoDevolucionRequest;
import com.softdevoluciones.backend.dto.CrearDevolucionRequest;
import com.softdevoluciones.backend.dto.DetalleDevolucionRequest;
import com.softdevoluciones.backend.dto.DetalleDevolucionResponse;
import com.softdevoluciones.backend.dto.SolicitudDevolucionResponse;
import com.softdevoluciones.backend.entity.Compra;
import com.softdevoluciones.backend.entity.DetalleCompra;
import com.softdevoluciones.backend.entity.DetalleDevolucion;
import com.softdevoluciones.backend.entity.EstadoDevolucion;
import com.softdevoluciones.backend.entity.MotivoDevolucion;
import com.softdevoluciones.backend.entity.SolicitudDevolucion;
import com.softdevoluciones.backend.entity.Usuario;
import com.softdevoluciones.backend.exception.RecursoNoEncontradoException;
import com.softdevoluciones.backend.exception.ReglaNegocioException;
import com.softdevoluciones.backend.repository.CompraRepository;
import com.softdevoluciones.backend.repository.DetalleCompraRepository;
import com.softdevoluciones.backend.repository.DetalleDevolucionRepository;
import com.softdevoluciones.backend.repository.SolicitudDevolucionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class SolicitudDevolucionService {

    private final CompraRepository compraRepository;
    private final DetalleCompraRepository detalleCompraRepository;
    private final SolicitudDevolucionRepository solicitudDevolucionRepository;
    private final DetalleDevolucionRepository detalleDevolucionRepository;

    @Transactional
    public SolicitudDevolucionResponse crearSolicitud(
            Long usuarioId,
            CrearDevolucionRequest request
    ) {

        Compra compra = compraRepository
                .findByIdAndUsuarioId(
                        request.getCompraId(),
                        usuarioId
                )
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Compra no encontrada o no pertenece al usuario"
                        )
                );

        validarDetallesDuplicados(request);

        Usuario usuario = compra.getUsuario();

        SolicitudDevolucion solicitud =
                SolicitudDevolucion.builder()
                        .fechaSolicitud(LocalDateTime.now())
                        .estado(EstadoDevolucion.SOLICITADA)
                        .motivo(request.getMotivo())
                        .comentario(
                                limpiarTexto(request.getComentario())
                        )
                        .importe(BigDecimal.ZERO)
                        .compra(compra)
                        .usuario(usuario)
                        .build();

        BigDecimal importeTotal = BigDecimal.ZERO;

        for (DetalleDevolucionRequest detalleRequest :
                request.getDetalles()) {

            DetalleCompra detalleCompra =
                    detalleCompraRepository
                            .findByIdAndCompraId(
                                    detalleRequest.getDetalleCompraId(),
                                    compra.getId()
                            )
                            .orElseThrow(() ->
                                    new ReglaNegocioException(
                                            "El producto indicado no pertenece a la compra"
                                    )
                            );

            int cantidadDisponible =
                    obtenerCantidadDisponible(
                            detalleCompra
                    );

            if (detalleRequest.getCantidad() <= 0) {
                throw new ReglaNegocioException(
                        "La cantidad a devolver debe ser mayor que cero"
                );
            }

            if (detalleRequest.getCantidad()
                    > cantidadDisponible) {

                throw new ReglaNegocioException(
                        "La cantidad solicitada supera las unidades disponibles "
                                + "para devolución del producto "
                                + detalleCompra
                                .getProducto()
                                .getNombre()
                );
            }

            BigDecimal importeDetalle =
                    detalleCompra
                            .getPrecioUnitario()
                            .multiply(
                                    BigDecimal.valueOf(
                                            detalleRequest.getCantidad()
                                    )
                            );

            DetalleDevolucion detalleDevolucion =
                    DetalleDevolucion.builder()
                            .cantidad(
                                    detalleRequest.getCantidad()
                            )
                            .importe(importeDetalle)
                            .solicitud(solicitud)
                            .detalleCompra(detalleCompra)
                            .build();

            solicitud
                    .getDetalles()
                    .add(detalleDevolucion);

            importeTotal =
                    importeTotal.add(
                            importeDetalle
                    );
        }

        solicitud.setImporte(
                importeTotal
        );

        SolicitudDevolucion guardada =
                solicitudDevolucionRepository
                        .save(solicitud);

        return mapearSolicitud(
                guardada
        );
    }

    @Transactional(readOnly = true)
    public List<SolicitudDevolucionResponse> listarPorUsuario(
            Long usuarioId
    ) {

        return solicitudDevolucionRepository
                .findByUsuarioIdOrderByFechaSolicitudDesc(
                        usuarioId
                )
                .stream()
                .map(this::mapearSolicitud)
                .toList();
    }

    @Transactional(readOnly = true)
    public SolicitudDevolucionResponse obtenerPorUsuario(
            Long solicitudId,
            Long usuarioId
    ) {

        SolicitudDevolucion solicitud =
                solicitudDevolucionRepository
                        .findByIdAndUsuarioId(
                                solicitudId,
                                usuarioId
                        )
                        .orElseThrow(() ->
                                new RecursoNoEncontradoException(
                                        "Solicitud de devolución no encontrada "
                                                + "o no pertenece al usuario"
                                )
                        );

        return mapearSolicitud(
                solicitud
        );
    }

    @Transactional(readOnly = true)
    public Page<SolicitudDevolucionResponse> listarAdministrativas(
            EstadoDevolucion estado,
            MotivoDevolucion motivo,
            LocalDate desde,
            LocalDate hasta,
            Pageable pageable
    ) {

        if (desde != null
                && hasta != null
                && desde.isAfter(hasta)) {

            throw new ReglaNegocioException(
                    "La fecha desde no puede ser posterior a la fecha hasta"
            );
        }

        Specification<SolicitudDevolucion> specification =
                (root, query, cb) -> cb.conjunction();

        if (estado != null) {

            specification =
                    specification.and(
                            (root, query, cb) ->
                                    cb.equal(
                                            root.get("estado"),
                                            estado
                                    )
                    );
        }

        if (motivo != null) {

            specification =
                    specification.and(
                            (root, query, cb) ->
                                    cb.equal(
                                            root.get("motivo"),
                                            motivo
                                    )
                    );
        }

        if (desde != null) {

            LocalDateTime fechaDesde =
                    desde.atStartOfDay();

            specification =
                    specification.and(
                            (root, query, cb) ->
                                    cb.greaterThanOrEqualTo(
                                            root.get("fechaSolicitud"),
                                            fechaDesde
                                    )
                    );
        }

        if (hasta != null) {

            LocalDateTime fechaHasta =
                    hasta
                            .plusDays(1)
                            .atStartOfDay();

            specification =
                    specification.and(
                            (root, query, cb) ->
                                    cb.lessThan(
                                            root.get("fechaSolicitud"),
                                            fechaHasta
                                    )
                    );
        }

        return solicitudDevolucionRepository
                .findAll(
                        specification,
                        pageable
                )
                .map(this::mapearSolicitud);
    }

    @Transactional
    public SolicitudDevolucionResponse cambiarEstado(
            Long solicitudId,
            CambiarEstadoDevolucionRequest request
    ) {

        SolicitudDevolucion solicitud =
                solicitudDevolucionRepository
                        .findById(solicitudId)
                        .orElseThrow(() ->
                                new RecursoNoEncontradoException(
                                        "Solicitud de devolución no encontrada"
                                )
                        );

        EstadoDevolucion estadoActual =
                solicitud.getEstado();

        EstadoDevolucion nuevoEstado =
                request.getEstado();

        validarTransicion(
                estadoActual,
                nuevoEstado
        );

        if (nuevoEstado
                == EstadoDevolucion.RECHAZADA) {

            if (request.getObservacion() == null
                    || request
                    .getObservacion()
                    .isBlank()) {

                throw new ReglaNegocioException(
                        "La observación es obligatoria al rechazar una devolución"
                );
            }

            solicitud.setObservacionOperador(
                    request
                            .getObservacion()
                            .trim()
            );
        }

        if (nuevoEstado
                == EstadoDevolucion.APROBADA) {

            validarCantidadesAntesDeAprobar(
                    solicitud
            );

            if (request.getObservacion() != null
                    && !request
                    .getObservacion()
                    .isBlank()) {

                solicitud.setObservacionOperador(
                        request
                                .getObservacion()
                                .trim()
                );
            }
        }

        if (nuevoEstado
                == EstadoDevolucion.EN_REVISION
                || nuevoEstado
                == EstadoDevolucion.COMPLETADA) {

            if (request.getObservacion() != null
                    && !request
                    .getObservacion()
                    .isBlank()) {

                solicitud.setObservacionOperador(
                        request
                                .getObservacion()
                                .trim()
                );
            }
        }

        solicitud.setEstado(
                nuevoEstado
        );

        SolicitudDevolucion actualizada =
                solicitudDevolucionRepository
                        .save(solicitud);

        return mapearSolicitud(
                actualizada
        );
    }

    private void validarTransicion(
            EstadoDevolucion estadoActual,
            EstadoDevolucion nuevoEstado
    ) {

        boolean transicionValida =
                switch (estadoActual) {

                    case SOLICITADA ->
                            nuevoEstado
                                    == EstadoDevolucion.EN_REVISION;

                    case EN_REVISION ->
                            nuevoEstado
                                    == EstadoDevolucion.APROBADA
                                    || nuevoEstado
                                    == EstadoDevolucion.RECHAZADA;

                    case APROBADA ->
                            nuevoEstado
                                    == EstadoDevolucion.COMPLETADA;

                    case RECHAZADA, COMPLETADA ->
                            false;
                };

        if (!transicionValida) {

            throw new ReglaNegocioException(
                    "No se puede cambiar el estado de "
                            + estadoActual
                            + " a "
                            + nuevoEstado
            );
        }
    }

    private void validarCantidadesAntesDeAprobar(
            SolicitudDevolucion solicitud
    ) {

        for (DetalleDevolucion detalle :
                solicitud.getDetalles()) {

            DetalleCompra detalleCompra =
                    detalle.getDetalleCompra();

            Integer cantidadDevuelta =
                    detalleDevolucionRepository
                            .sumarCantidadDevueltaAprobada(
                                    detalleCompra.getId()
                            );

            int devuelto =
                    cantidadDevuelta != null
                            ? cantidadDevuelta
                            : 0;

            int disponible =
                    detalleCompra.getCantidad()
                            - devuelto;

            if (detalle.getCantidad()
                    > disponible) {

                throw new ReglaNegocioException(
                        "No existen suficientes unidades disponibles "
                                + "para aprobar la devolución del producto "
                                + detalleCompra
                                .getProducto()
                                .getNombre()
                );
            }
        }
    }

    private int obtenerCantidadDisponible(
            DetalleCompra detalleCompra
    ) {

        Integer cantidadDevuelta =
                detalleDevolucionRepository
                        .sumarCantidadDevueltaAprobada(
                                detalleCompra.getId()
                        );

        int devuelto =
                cantidadDevuelta != null
                        ? cantidadDevuelta
                        : 0;

        return detalleCompra.getCantidad()
                - devuelto;
    }

    private void validarDetallesDuplicados(
            CrearDevolucionRequest request
    ) {

        Set<Long> detalleIds =
                new HashSet<>();

        for (DetalleDevolucionRequest detalle :
                request.getDetalles()) {

            if (!detalleIds.add(
                    detalle.getDetalleCompraId()
            )) {

                throw new ReglaNegocioException(
                        "No se puede repetir el mismo producto "
                                + "dentro de una solicitud de devolución"
                );
            }
        }
    }

    private String limpiarTexto(
            String texto
    ) {

        if (texto == null
                || texto.isBlank()) {

            return null;
        }

        return texto.trim();
    }

    private SolicitudDevolucionResponse mapearSolicitud(
            SolicitudDevolucion solicitud
    ) {

        List<DetalleDevolucionResponse> detalles =
                solicitud
                        .getDetalles()
                        .stream()
                        .map(detalle ->
                                DetalleDevolucionResponse
                                        .builder()
                                        .id(
                                                detalle.getId()
                                        )
                                        .detalleCompraId(
                                                detalle
                                                        .getDetalleCompra()
                                                        .getId()
                                        )
                                        .productoNombre(
                                                detalle
                                                        .getDetalleCompra()
                                                        .getProducto()
                                                        .getNombre()
                                        )
                                        .cantidad(
                                                detalle.getCantidad()
                                        )
                                        .importe(
                                                detalle.getImporte()
                                        )
                                        .build()
                        )
                        .toList();

        return SolicitudDevolucionResponse
                .builder()
                .id(
                        solicitud.getId()
                )
                .compraId(
                        solicitud
                                .getCompra()
                                .getId()
                )
                .fechaSolicitud(
                        solicitud.getFechaSolicitud()
                )
                .estado(
                        solicitud.getEstado()
                )
                .motivo(
                        solicitud.getMotivo()
                )
                .comentario(
                        solicitud.getComentario()
                )
                .observacionOperador(
                        solicitud.getObservacionOperador()
                )
                .importe(
                        solicitud.getImporte()
                )
                .detalles(
                        detalles
                )
                .build();
    }
}
