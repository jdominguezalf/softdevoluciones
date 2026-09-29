package com.softdevoluciones.backend.dto;

import com.softdevoluciones.backend.entity.MotivoDevolucion;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CrearDevolucionRequest {

    @NotNull(message = "La compra es obligatoria")
    private Long compraId;

    @NotNull(message = "El motivo es obligatorio")
    private MotivoDevolucion motivo;

    @Size(max = 500, message = "El comentario no puede superar los 500 caracteres")
    private String comentario;

    @Valid
    @NotEmpty(message = "Debe seleccionar al menos un producto")
    private List<DetalleDevolucionRequest> detalles;
}