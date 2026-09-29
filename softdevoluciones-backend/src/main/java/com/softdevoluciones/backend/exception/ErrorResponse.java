package com.softdevoluciones.backend.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ErrorResponse {

    private LocalDateTime fecha;
    private int estado;
    private String error;
    private String mensaje;
    private String ruta;
}