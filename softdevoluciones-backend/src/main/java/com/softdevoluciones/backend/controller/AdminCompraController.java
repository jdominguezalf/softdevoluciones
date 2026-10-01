package com.softdevoluciones.backend.controller;

import com.softdevoluciones.backend.dto.CompraResponse;
import com.softdevoluciones.backend.service.CompraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/compras")
@RequiredArgsConstructor
public class AdminCompraController {

    private final CompraService compraService;

    @GetMapping
    public ResponseEntity<List<CompraResponse>> listarTodasLasCompras() {

        return ResponseEntity.ok(
                compraService.listarTodasLasCompras()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompraResponse> obtenerCompra(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                compraService.obtenerCompraPorId(id)
        );
    }
}