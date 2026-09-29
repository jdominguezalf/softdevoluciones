package com.softdevoluciones.backend.dto;

import com.softdevoluciones.backend.entity.Rol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UsuarioResponse {

    private Long id;
    private String nombre;
    private String email;
    private Rol rol;
}