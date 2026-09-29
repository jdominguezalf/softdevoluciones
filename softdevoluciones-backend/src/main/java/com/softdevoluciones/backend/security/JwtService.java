package com.softdevoluciones.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey obtenerClave() {
        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generarToken(UserDetails userDetails) {

        Date ahora = new Date();
        Date expiracion = new Date(
                ahora.getTime() + expiration
        );

        return Jwts.builder()
                .subject(userDetails.getUsername())
                .issuedAt(ahora)
                .expiration(expiracion)
                .signWith(obtenerClave())
                .compact();
    }

    public String obtenerEmail(String token) {

        return obtenerClaims(token)
                .getSubject();
    }

    public boolean esTokenValido(
            String token,
            UserDetails userDetails
    ) {

        String email = obtenerEmail(token);

        return email.equals(userDetails.getUsername())
                && !estaExpirado(token);
    }

    private boolean estaExpirado(String token) {

        return obtenerClaims(token)
                .getExpiration()
                .before(new Date());
    }

    private Claims obtenerClaims(String token) {

        return Jwts.parser()
                .verifyWith(obtenerClave())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}