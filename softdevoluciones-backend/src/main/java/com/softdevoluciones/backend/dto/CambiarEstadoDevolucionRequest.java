package com.softdevoluciones.backend.dto;

import com.softdevoluciones.backend.entity.EstadoDevolucion;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CambiarEstadoDevolucionRequest {

    @NotNull(message = "El nuevo estado es obligatorio")
    private EstadoDevolucion estado;

    @Size(max = 500, message = "La observación no puede superar los 500 caracteres")
    private String observacion;
}