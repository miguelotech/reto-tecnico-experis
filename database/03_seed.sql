-- datos por defecto. los id son fijos y el insert es upsert, asi que correrlo
-- de nuevo reescribe las mismas filas en vez de duplicarlas.
-- el prefijo del uuid dice el estado (aaaa pendiente, bbbb en progreso, cccc
-- completada) para poder copiar uno a mano al probar el detalle.

INSERT INTO priorities (id, code, name, sort_order) VALUES
    (1, 'LOW',    'Baja',  3),
    (2, 'MEDIUM', 'Media', 2),
    (3, 'HIGH',   'Alta',  1)
ON CONFLICT (id) DO UPDATE
    SET code       = EXCLUDED.code,
        name       = EXCLUDED.name,
        sort_order = EXCLUDED.sort_order;

INSERT INTO statuses (id, code, name, sort_order) VALUES
    (1, 'PENDING',     'Pendiente',   1),
    (2, 'IN_PROGRESS', 'En progreso', 2),
    (3, 'COMPLETED',   'Completada',  3)
ON CONFLICT (id) DO UPDATE
    SET code       = EXCLUDED.code,
        name       = EXCLUDED.name,
        sort_order = EXCLUDED.sort_order;

-- 18 tareas: las 9 combinaciones de estado x prioridad, 2 cada una.
-- created_at escalonado a proposito para que el orden del listado sea siempre el mismo.
INSERT INTO tasks (id, title, description, priority_id, status_id, due_date, created_at, updated_at) VALUES

    ('aaaaaaaa-0000-4000-8000-000000000001',
     'Renovar el pasaporte antes del viaje de diciembre',
     'La cita en migraciones se agenda en linea y hay lista de espera de tres semanas. Llevar DNI vigente, el recibo de pago y una foto tamano pasaporte con fondo blanco.',
     3, 1, now() + INTERVAL '9 days',  now() - INTERVAL '1 day',  now() - INTERVAL '1 day'),

    -- titulo de 198 chars, para ver como trunca la tarjeta
    ('aaaaaaaa-0000-4000-8000-000000000002',
     'Revisar y consolidar el presupuesto familiar del ultimo trimestre, separar gastos fijos de variables, identificar suscripciones que ya no se usan y dejar listo el resumen para conversarlo el domingo',
     'Exportar los movimientos del banco a CSV y clasificarlos por categoria antes de armar el resumen.',
     3, 1, now() + INTERVAL '4 days',  now() - INTERVAL '2 days', now() - INTERVAL '2 days'),

    ('aaaaaaaa-0000-4000-8000-000000000003',
     'Comparar planes de internet para el departamento',
     'El contrato actual vence a fin de mes. Contrastar velocidad simetrica, permanencia minima y costo de instalacion entre las tres operadoras de la zona.',
     2, 1, now() + INTERVAL '15 days', now() - INTERVAL '3 days', now() - INTERVAL '3 days'),

    -- sin descripcion, para probar el placeholder en el detalle
    ('aaaaaaaa-0000-4000-8000-000000000004',
     'Agendar la revision tecnica vehicular',
     NULL,
     2, 1, now() + INTERVAL '21 days', now() - INTERVAL '4 days', now() - INTERVAL '4 days'),

    ('aaaaaaaa-0000-4000-8000-000000000005',
     'Reorganizar la biblioteca por autor',
     'Separar ademas los libros que ya no voy a releer para donarlos junto con la ropa.',
     1, 1, NULL,                        now() - INTERVAL '5 days', now() - INTERVAL '5 days'),

    ('aaaaaaaa-0000-4000-8000-000000000006',
     'Buscar una receta decente de pan de masa madre',
     NULL,
     1, 1, NULL,                        now() - INTERVAL '6 days', now() - INTERVAL '6 days'),

    ('bbbbbbbb-0000-4000-8000-000000000001',
     'Terminar el reto tecnico de React Native y .NET',
     'Pendiente cerrar la capa de persistencia con Dapper, las tres pantallas del movil y los diagramas de arquitectura en Mermaid.',
     3, 2, now() + INTERVAL '2 days',  now() - INTERVAL '7 days',  now() - INTERVAL '7 days'),

    ('bbbbbbbb-0000-4000-8000-000000000002',
     'Migrar las fotos del disco externo a la nube',
     'Van 40 GB de 260 GB. El disco viejo ya dio un error de lectura, conviene priorizarlo antes de que falle del todo.',
     3, 2, now() + INTERVAL '6 days',  now() - INTERVAL '8 days',  now() - INTERVAL '8 days'),

    ('bbbbbbbb-0000-4000-8000-000000000003',
     'Leer el libro de arquitectura hexagonal que quedo a medias',
     'Voy por el capitulo 5, el de puertos y adaptadores. Anotar las ideas que apliquen al reto tecnico.',
     2, 2, NULL,                        now() - INTERVAL '9 days',  now() - INTERVAL '9 days'),

    ('bbbbbbbb-0000-4000-8000-000000000004',
     'Preparar la presentacion de resultados del equipo',
     'Faltan los graficos de la seccion de metricas y ensayar la parte final para que entre en los 15 minutos.',
     2, 2, now() + INTERVAL '5 days',  now() - INTERVAL '10 days', now() - INTERVAL '10 days'),

    ('bbbbbbbb-0000-4000-8000-000000000005',
     'Aprender los atajos de teclado del editor',
     'Practicar quince minutos al dia. Empezar por navegacion entre buffers y busqueda en el proyecto.',
     1, 2, NULL,                        now() - INTERVAL '11 days', now() - INTERVAL '11 days'),

    ('bbbbbbbb-0000-4000-8000-000000000006',
     'Plantar albahaca y romero en el balcon',
     'La albahaca ya germino. Falta trasplantar el romero a una maceta mas honda y moverlo al lado que recibe sol por la manana.',
     1, 2, NULL,                        now() - INTERVAL '12 days', now() - INTERVAL '12 days'),

    ('cccccccc-0000-4000-8000-000000000001',
     'Pagar el impuesto predial del primer trimestre',
     'Pagado en linea. El comprobante quedo guardado en la carpeta de documentos del ano.',
     3, 3, now() - INTERVAL '3 days',  now() - INTERVAL '13 days', now() - INTERVAL '13 days'),

    ('cccccccc-0000-4000-8000-000000000002',
     'Configurar el respaldo automatico de la laptop',
     'Respaldo diario a las 2 de la madrugada, con verificacion semanal de que la copia se puede restaurar.',
     3, 3, now() - INTERVAL '10 days', now() - INTERVAL '14 days', now() - INTERVAL '14 days'),

    ('cccccccc-0000-4000-8000-000000000003',
     'Renovar la suscripcion del dominio personal',
     'Renovado por dos anos y activada la renovacion automatica para no volver a estar al borde del vencimiento.',
     2, 3, now() - INTERVAL '6 days',  now() - INTERVAL '15 days', now() - INTERVAL '15 days'),

    ('cccccccc-0000-4000-8000-000000000004',
     'Donar la ropa que ya no uso',
     'Tres bolsas entregadas en el centro de acopio del distrito.',
     2, 3, now() - INTERVAL '20 days', now() - INTERVAL '16 days', now() - INTERVAL '16 days'),

    ('cccccccc-0000-4000-8000-000000000005',
     'Cancelar la suscripcion de streaming que no uso',
     'Cancelada. El cobro se detiene al terminar el periodo ya pagado.',
     1, 3, now() - INTERVAL '25 days', now() - INTERVAL '17 days', now() - INTERVAL '17 days'),

    ('cccccccc-0000-4000-8000-000000000006',
     'Actualizar la foto del perfil profesional',
     'Foto nueva subida y descripcion del perfil reescrita en dos parrafos.',
     1, 3, NULL,                        now() - INTERVAL '18 days', now() - INTERVAL '18 days')

ON CONFLICT (id) DO UPDATE
    SET title       = EXCLUDED.title,
        description = EXCLUDED.description,
        priority_id = EXCLUDED.priority_id,
        status_id   = EXCLUDED.status_id,
        due_date    = EXCLUDED.due_date,
        created_at  = EXCLUDED.created_at,
        updated_at  = now();
