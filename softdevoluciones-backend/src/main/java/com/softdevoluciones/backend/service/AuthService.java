package com.softdevoluciones.backend.service;

import com.softdevoluciones.backend.dto.AuthResponse;
import com.softdevoluciones.backend.dto.LoginRequest;
import com.softdevoluciones.backend.dto.RegistroRequest;
import com.softdevoluciones.backend.dto.UsuarioResponse;
import com.softdevoluciones.backend.entity.Rol;
import com.softdevoluciones.backend.entity.Usuario;
import com.softdevoluciones.backend.exception.ReglaNegocioException;
import com.softdevoluciones.backend.repository.UsuarioRepository;
import com.softdevoluciones.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse registrar(RegistroRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (usuarioRepository.existsByEmail(email)) {
            throw new ReglaNegocioException(
                    "Ya existe un usuario registrado con ese correo"
            );
        }

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .rol(Rol.CLIENTE)
                .build();

        Usuario guardado = usuarioRepository.save(usuario);

        UserDetails userDetails = User.builder()
                .username(guardado.getEmail())
                .password(guardado.getPassword())
                .roles(guardado.getRol().name())
                .build();

        String token = jwtService.generarToken(userDetails);

        return new AuthResponse(
                token,
                mapearUsuario(guardado)
        );
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        Usuario usuario = usuarioRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ReglaNegocioException(
                                "Credenciales inválidas"
                        )
                );

        UserDetails userDetails = User.builder()
                .username(usuario.getEmail())
                .password(usuario.getPassword())
                .roles(usuario.getRol().name())
                .build();

        String token = jwtService.generarToken(userDetails);

        return new AuthResponse(
                token,
                mapearUsuario(usuario)
        );
    }

    private UsuarioResponse mapearUsuario(Usuario usuario) {

        return UsuarioResponse.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol())
                .build();
    }
}