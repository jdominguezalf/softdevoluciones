package com.softdevoluciones.backend.dto;

import com.softdevoluciones.backend.entity.EstadoDevolucion;
import com.softdevoluciones.backend.entity.MotivoDevolucion;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class SolicitudDevolucionResponse {

    private Long id;
    private Long compraId;
    private LocalDateTime fechaSolicitud;
    private EstadoDevolucion estado;
    private MotivoDevolucion motivo;
    private String comentario;
    private String observacionOperador;
    private BigDecimal importe;
    private List<DetalleDevolucionResponse> detalles;
}