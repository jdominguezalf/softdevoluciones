import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Compra } from '../../core/models/compra.model';
import { CompraService } from '../../core/services/compra.service';
import { DevolucionService } from '../../core/services/devolucion.service';

@Component({
  selector: 'app-devolucion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './devolucion-form.component.html',
  styleUrl: './devolucion-form.component.scss',
})
export class DevolucionFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly compraService = inject(CompraService);

  private readonly devolucionService = inject(DevolucionService);

  compra = signal<Compra | null>(null);

  cargando = signal(true);
  enviando = signal(false);

  error = signal('');
  exito = signal('');

  formulario = this.fb.group({
    motivo: ['', Validators.required],

    comentario: ['', Validators.maxLength(500)],

    detalles: this.fb.array([]),
  });

  get detalles(): FormArray {
    return this.formulario.controls.detalles;
  }

  ngOnInit(): void {
    this.cargarCompra();
  }

  cargarCompra(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.error.set('Compra no válida');
      this.cargando.set(false);
      return;
    }

    this.compraService.obtenerCompra(id).subscribe({
      next: (compra) => {
        this.compra.set(compra);

        compra.detalles.forEach((detalle) => {
          this.detalles.push(
            this.fb.group({
              detalleCompraId: [detalle.id],

              seleccionado: [false],

              cantidad: [
                1,
                [Validators.required, Validators.min(1), Validators.max(detalle.cantidad)],
              ],
            }),
          );
        });

        this.cargando.set(false);
      },

      error: (err) => {
        this.cargando.set(false);

        this.error.set(err?.error?.mensaje ?? 'No se pudo cargar la compra');
      },
    });
  }

  enviar(): void {
    const compra = this.compra();

    if (!compra) {
      return;
    }

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const seleccionados = this.detalles.controls
      .filter((control) => control.value.seleccionado)
      .map((control) => ({
        detalleCompraId: control.value.detalleCompraId,

        cantidad: Number(control.value.cantidad),
      }));

    if (seleccionados.length === 0) {
      this.error.set('Selecciona al menos un producto.');

      return;
    }

    this.error.set('');
    this.exito.set('');
    this.enviando.set(true);

    const request = {
      compraId: compra.id,

      motivo: this.formulario.controls.motivo.value as any,

      comentario: this.formulario.controls.comentario.value ?? '',

      detalles: seleccionados,
    };

    this.devolucionService.crearSolicitud(request).subscribe({
      next: () => {
        this.enviando.set(false);

        this.exito.set('Solicitud de devolución registrada correctamente.');

        setTimeout(() => {
          this.router.navigate(['/cliente/compras']);
        }, 1200);
      },

      error: (err) => {
        this.enviando.set(false);

        this.error.set(err?.error?.mensaje ?? 'No se pudo registrar la devolución');
      },
    });
  }

  volver(): void {
    const compra = this.compra();

    if (!compra) {
      this.router.navigate(['/cliente/compras']);

      return;
    }

    this.router.navigate(['/cliente/compras', compra.id]);
  }
}
