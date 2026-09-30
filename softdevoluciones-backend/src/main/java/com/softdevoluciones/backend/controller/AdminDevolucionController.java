package com.softdevoluciones.backend.controller;

import com.softdevoluciones.backend.dto.CambiarEstadoDevolucionRequest;
import com.softdevoluciones.backend.dto.SolicitudDevolucionResponse;
import com.softdevoluciones.backend.entity.EstadoDevolucion;
import com.softdevoluciones.backend.entity.MotivoDevolucion;
import com.softdevoluciones.backend.service.SolicitudDevolucionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/devoluciones")
@RequiredArgsConstructor
public class AdminDevolucionController {

    private final SolicitudDevolucionService solicitudDevolucionService;

    @GetMapping
    public ResponseEntity<Page<SolicitudDevolucionResponse>> listarDevoluciones(
            @RequestParam(required = false)
            EstadoDevolucion estado,

            @RequestParam(required = false)
            MotivoDevolucion motivo,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate desde,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate hasta,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size
    ) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(
                        Sort.Direction.DESC,
                        "fechaSolicitud"
                )
        );

        Page<SolicitudDevolucionResponse> response =
                solicitudDevolucionService.listarAdministrativas(
                        estado,
                        motivo,
                        desde,
                        hasta,
                        pageable
                );

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<SolicitudDevolucionResponse> cambiarEstado(
            @PathVariable Long id,
            @Valid
            @RequestBody
            CambiarEstadoDevolucionRequest request
    ) {

        SolicitudDevolucionResponse response =
                solicitudDevolucionService.cambiarEstado(
                        id,
                        request
                );

        return ResponseEntity.ok(response);
    }
}