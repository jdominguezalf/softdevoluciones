package com.softdevoluciones.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitudes_devolucion")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SolicitudDevolucion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fechaSolicitud;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoDevolucion estado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MotivoDevolucion motivo;

    @Column(length = 500)
    private String comentario;

    @Column(length = 500)
    private String observacionOperador;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal importe;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "compra_id", nullable = false)
    private Compra compra;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(
            mappedBy = "solicitud",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<DetalleDevolucion> detalles = new ArrayList<>();
}