import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Compra } from '../../core/models/compra.model';

import { CrearDevolucionRequest } from '../../core/models/devolucion.model';

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
    comentario: [''],
    detalles: this.fb.array([]),
  });

  ngOnInit(): void {
    const compraId = Number(this.route.snapshot.paramMap.get('id'));

    if (!compraId) {
      this.error.set('No se encontró la compra seleccionada');

      this.cargando.set(false);

      return;
    }

    this.cargarCompra(compraId);
  }

  get detalles(): FormArray {
    return this.formulario.controls.detalles;
  }

  cargarCompra(compraId: number): void {
    this.cargando.set(true);
    this.error.set('');

    this.compraService.obtenerCompra(compraId).subscribe({
      next: (response) => {
        this.compra.set(response);

        this.crearControles(response);

        this.cargando.set(false);
      },

      error: (err) => {
        this.cargando.set(false);

        this.error.set(err?.error?.mensaje ?? 'No se pudo cargar la compra');
      },
    });
  }

  crearControles(compra: Compra): void {
    this.detalles.clear();

    compra.detalles.forEach((detalle) => {
      this.detalles.push(
        this.fb.group({
          detalleCompraId: [detalle.id],
          seleccionado: [false],
          cantidad: [1, [Validators.required, Validators.min(1), Validators.max(detalle.cantidad)]],
        }),
      );
    });
  }

  estaSeleccionado(index: number): boolean {
    return Boolean(this.detalles.at(index).get('seleccionado')?.value);
  }

  cambiarSeleccion(index: number): void {
    const grupo = this.detalles.at(index);

    const seleccionado = grupo.get('seleccionado')?.value;

    if (!seleccionado) {
      grupo.get('cantidad')?.setValue(1);
    }
  }

  enviarSolicitud(): void {
    this.error.set('');
    this.exito.set('');

    if (this.formulario.controls.motivo.invalid) {
      this.formulario.markAllAsTouched();

      this.error.set('Selecciona el motivo de la devolución.');

      return;
    }

    const compraActual = this.compra();

    if (!compraActual) {
      return;
    }

    const detallesSeleccionados = this.detalles.controls.filter(
      (control) => control.get('seleccionado')?.value,
    );

    if (detallesSeleccionados.length === 0) {
      this.error.set('Selecciona al menos un producto para devolver.');

      return;
    }

    const existeCantidadInvalida = detallesSeleccionados.some(
      (control) => control.get('cantidad')?.invalid,
    );

    if (existeCantidadInvalida) {
      this.error.set('Revisa las cantidades seleccionadas.');

      return;
    }

    const request: CrearDevolucionRequest = {
      compraId: compraActual.id,

      motivo: this.formulario.controls.motivo.value as CrearDevolucionRequest['motivo'],

      comentario: this.formulario.controls.comentario.value ?? '',

      detalles: detallesSeleccionados.map((control) => ({
        detalleCompraId: Number(control.get('detalleCompraId')?.value),

        cantidad: Number(control.get('cantidad')?.value),
      })),
    };

    this.enviando.set(true);

    this.devolucionService.crearSolicitud(request).subscribe({
      next: () => {
        this.enviando.set(false);

        this.exito.set('Tu solicitud de devolución fue registrada correctamente.');

        setTimeout(() => {
          this.router.navigate(['/cliente/devoluciones']);
        }, 1200);
      },

      error: (err) => {
        this.enviando.set(false);

        this.error.set(err?.error?.mensaje ?? 'No se pudo registrar la solicitud');
      },
    });
  }

  volver(): void {
    const compraActual = this.compra();

    if (compraActual) {
      this.router.navigate(['/cliente/compras', compraActual.id]);

      return;
    }

    this.router.navigate(['/cliente/compras']);
  }
}
