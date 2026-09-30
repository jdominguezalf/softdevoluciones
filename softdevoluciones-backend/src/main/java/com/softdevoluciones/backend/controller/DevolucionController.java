package com.softdevoluciones.backend.controller;

import com.softdevoluciones.backend.dto.CrearDevolucionRequest;
import com.softdevoluciones.backend.dto.SolicitudDevolucionResponse;
import com.softdevoluciones.backend.entity.Usuario;
import com.softdevoluciones.backend.exception.RecursoNoEncontradoException;
import com.softdevoluciones.backend.repository.UsuarioRepository;
import com.softdevoluciones.backend.service.SolicitudDevolucionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devoluciones")
@RequiredArgsConstructor
public class DevolucionController {

    private final SolicitudDevolucionService solicitudDevolucionService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping
    public ResponseEntity<SolicitudDevolucionResponse> crearDevolucion(
            @Valid @RequestBody CrearDevolucionRequest request,
            Authentication authentication
    ) {

        Usuario usuario = obtenerUsuarioAutenticado(authentication);

        SolicitudDevolucionResponse response =
                solicitudDevolucionService.crearSolicitud(
                        usuario.getId(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/mis-devoluciones")
    public List<SolicitudDevolucionResponse> listarMisDevoluciones(
            Authentication authentication
    ) {

        Usuario usuario = obtenerUsuarioAutenticado(authentication);

        return solicitudDevolucionService.listarPorUsuario(
                usuario.getId()
        );
    }

    @GetMapping("/{id}")
    public SolicitudDevolucionResponse obtenerDevolucion(
            @PathVariable Long id,
            Authentication authentication
    ) {

        Usuario usuario = obtenerUsuarioAutenticado(authentication);

        return solicitudDevolucionService.obtenerPorUsuario(
                id,
                usuario.getId()
        );
    }

    private Usuario obtenerUsuarioAutenticado(
            Authentication authentication
    ) {

        String email = authentication.getName();

        return usuarioRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Usuario autenticado no encontrado"
                        )
                );
    }
}