package com.softdevoluciones.backend.service;

import com.softdevoluciones.backend.dto.AdminUsuarioResponse;
import com.softdevoluciones.backend.entity.Usuario;
import com.softdevoluciones.backend.exception.RecursoNoEncontradoException;
import com.softdevoluciones.backend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<AdminUsuarioResponse> listarUsuarios() {

        return usuarioRepository
                .findAll()
                .stream()
                .map(this::mapearUsuario)
                .toList();
    }

    @Transactional(readOnly = true)
    public AdminUsuarioResponse obtenerUsuario(Long id) {

        Usuario usuario = usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new RecursoNoEncontradoException(
                                "Usuario no encontrado"
                        )
                );

        return mapearUsuario(usuario);
    }

    private AdminUsuarioResponse mapearUsuario(
            Usuario usuario
    ) {

        return AdminUsuarioResponse
                .builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol())
                .build();
    }
}