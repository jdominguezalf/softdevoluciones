package com.softdevoluciones.backend.controller;

import com.softdevoluciones.backend.dto.CompraResponse;
import com.softdevoluciones.backend.entity.Usuario;
import com.softdevoluciones.backend.exception.RecursoNoEncontradoException;
import com.softdevoluciones.backend.repository.UsuarioRepository;
import com.softdevoluciones.backend.service.CompraService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras")
@RequiredArgsConstructor
public class CompraController {

    private final CompraService compraService;
    private final UsuarioRepository usuarioRepository;

    @GetMapping("/mis-compras")
    public List<CompraResponse> listarMisCompras(
            Authentication authentication
    ) {

        Usuario usuario = obtenerUsuarioAutenticado(authentication);

        return compraService.listarComprasUsuario(
                usuario.getId()
        );
    }

    @GetMapping("/{id}")
    public CompraResponse obtenerCompra(
            @PathVariable Long id,
            Authentication authentication
    ) {

        Usuario usuario = obtenerUsuarioAutenticado(authentication);

        return compraService.obtenerCompraUsuario(
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