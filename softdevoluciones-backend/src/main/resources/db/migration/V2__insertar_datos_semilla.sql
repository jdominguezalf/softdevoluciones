-- Usuarios demo
-- Las contraseñas se almacenan con BCrypt.

INSERT INTO usuarios (nombre, email, password, rol)
VALUES
    (
        'Cliente Demo',
        'cliente@softdevoluciones.com',
        '$2y$10$1DfodzrG7Kt8j8edwVIa8.U3XerAsq9vlJERdfslfy0hpNFNfc2D2',
        'CLIENTE'
    ),
    (
        'Operador Demo',
        'operador@softdevoluciones.com',
        '$2y$10$iE...TNgLKREBQXCDcBVHeTfIXq0r6ADrgpGnx.JGuNHf9Carpx8K',
        'OPERADOR'
    ),
    (
        'Administrador Demo',
        'admin@softdevoluciones.com',
        '$2y$10$itaQEJv9otNj.D7n.fVk1e3rUjzSjC3f6xeVCMldYvP/1blDUn6Ka',
        'ADMIN'
    );

-- Productos
INSERT INTO productos (nombre, descripcion, activo)
VALUES
    ('Teclado mecánico RGB', 'Teclado mecánico con iluminación RGB.', TRUE),
    ('Mouse gamer', 'Mouse óptico con botones programables.', TRUE),
    ('Audífonos gamer', 'Audífonos con micrófono integrado.', TRUE),
    ('Monitor 24 pulgadas', 'Monitor Full HD de 24 pulgadas.', TRUE),
    ('Mousepad XL', 'Mousepad de superficie amplia.', TRUE);

-- Primera compra preexistente
WITH nueva_compra AS (
INSERT INTO compras (
    fecha,
    total,
    estado,
    usuario_id
)
SELECT
    DATE '2026-09-15',
    459.70,
    'ENTREGADA',
    id
FROM usuarios
WHERE email = 'cliente@softdevoluciones.com'
    RETURNING id
)
INSERT INTO detalle_compras (
    cantidad,
    precio_unitario,
    compra_id,
    producto_id
)
SELECT
    datos.cantidad,
    datos.precio,
    nueva_compra.id,
    productos.id
FROM nueva_compra
         CROSS JOIN (
    VALUES
        ('Teclado mecánico RGB', 1, 189.90::NUMERIC),
        ('Mouse gamer', 1, 129.90::NUMERIC),
        ('Audífonos gamer', 1, 139.90::NUMERIC)
) AS datos(nombre, cantidad, precio)
         JOIN productos
              ON productos.nombre = datos.nombre;

-- Segunda compra preexistente
WITH nueva_compra AS (
INSERT INTO compras (
    fecha,
    total,
    estado,
    usuario_id
)
SELECT
    DATE '2026-09-22',
    969.80,
    'ENTREGADA',
    id
FROM usuarios
WHERE email = 'cliente@softdevoluciones.com'
    RETURNING id
)
INSERT INTO detalle_compras (
    cantidad,
    precio_unitario,
    compra_id,
    producto_id
)
SELECT
    datos.cantidad,
    datos.precio,
    nueva_compra.id,
    productos.id
FROM nueva_compra
         CROSS JOIN (
    VALUES
        ('Monitor 24 pulgadas', 1, 899.90::NUMERIC),
        ('Mousepad XL', 1, 69.90::NUMERIC)
) AS datos(nombre, cantidad, precio)
         JOIN productos
              ON productos.nombre = datos.nombre;