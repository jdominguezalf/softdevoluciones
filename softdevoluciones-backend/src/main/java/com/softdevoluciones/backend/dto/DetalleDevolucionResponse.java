package com.softdevoluciones.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class DetalleDevolucionResponse {

    private Long id;
    private Long detalleCompraId;
    private String productoNombre;
    private Integer cantidad;
    private BigDecimal importe;
}