package com.softdevoluciones.backend.dto;

import com.softdevoluciones.backend.entity.EstadoCompra;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class CompraResponse {

    private Long id;
    private LocalDate fecha;
    private BigDecimal total;
    private EstadoCompra estado;
    private List<DetalleCompraResponse> detalles;
}