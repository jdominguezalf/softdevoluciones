package com.softdevoluciones.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
@AllArgsConstructor
public class DetalleCompraResponse {

    private Long id;
    private Long productoId;
    private String productoNombre;
    private String productoDescripcion;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}