package com.softdevoluciones.backend.controller;

import com.softdevoluciones.backend.dto.AdminUsuarioResponse;
import com.softdevoluciones.backend.service.AdminUsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/usuarios")
@RequiredArgsConstructor
public class AdminUsuarioController {

    private final AdminUsuarioService adminUsuarioService;

    @GetMapping
    public ResponseEntity<List<AdminUsuarioResponse>> listarUsuarios() {

        return ResponseEntity.ok(
                adminUsuarioService.listarUsuarios()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUsuarioResponse> obtenerUsuario(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                adminUsuarioService.obtenerUsuario(id)
        );
    }
}