-- en postgres CREATE PROCEDURE no devuelve result sets: para retornar filas
-- habria que sacarlas por un refcursor. lo idiomatico es FUNCTION ... RETURNS
-- TABLE, que se llama con SELECT * FROM sp_xxx(...). uso eso y mantengo el
-- prefijo sp_. va explicado en el ADR.
--
-- hace falta DROP y no basta CREATE OR REPLACE porque REPLACE no deja cambiar
-- el tipo de retorno.

DROP FUNCTION IF EXISTS sp_get_tasks(VARCHAR, VARCHAR);

CREATE FUNCTION sp_get_tasks(
    p_status_code   VARCHAR(20) DEFAULT NULL,
    p_priority_code VARCHAR(20) DEFAULT NULL
)
RETURNS TABLE (
    id             UUID,
    title          VARCHAR(200),
    description    TEXT,
    priority_code  VARCHAR(20),
    priority_name  VARCHAR(50),
    status_code    VARCHAR(20),
    status_name    VARCHAR(50),
    due_date       TIMESTAMPTZ,
    created_at     TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    -- normalizo aca para que ?status= o ?status=pending no devuelvan vacio.
    -- validar que el codigo exista es cosa de la capa de aplicacion, que responde 400.
    v_status_code   VARCHAR(20) := NULLIF(btrim(upper(p_status_code)),   '');
    v_priority_code VARCHAR(20) := NULLIF(btrim(upper(p_priority_code)), '');
BEGIN
    RETURN QUERY
    SELECT
        t.id,
        t.title,
        t.description,
        p.code AS priority_code,
        p.name AS priority_name,
        s.code AS status_code,
        s.name AS status_name,
        t.due_date,
        t.created_at
    FROM tasks t
        INNER JOIN priorities p ON p.id = t.priority_id
        INNER JOIN statuses   s ON s.id = t.status_id
    -- este patron cubre las 4 combinaciones de filtro sin armar SQL dinamico
    WHERE (v_status_code   IS NULL OR s.code = v_status_code)
      AND (v_priority_code IS NULL OR p.code = v_priority_code)
    ORDER BY p.sort_order ASC, t.created_at DESC;
END;
$$;

DROP FUNCTION IF EXISTS sp_get_task_by_id(UUID);

-- devuelve 0 o 1 fila. traducir las 0 filas a un 404 le toca a la aplicacion.
CREATE FUNCTION sp_get_task_by_id(p_id UUID)
RETURNS TABLE (
    id             UUID,
    title          VARCHAR(200),
    description    TEXT,
    priority_code  VARCHAR(20),
    priority_name  VARCHAR(50),
    status_code    VARCHAR(20),
    status_name    VARCHAR(50),
    due_date       TIMESTAMPTZ,
    created_at     TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT
        t.id,
        t.title,
        t.description,
        p.code AS priority_code,
        p.name AS priority_name,
        s.code AS status_code,
        s.name AS status_name,
        t.due_date,
        t.created_at
    FROM tasks t
        INNER JOIN priorities p ON p.id = t.priority_id
        INNER JOIN statuses   s ON s.id = t.status_id
    WHERE t.id = p_id;
END;
$$;

-- catalogos, para no hardcodear las opciones de filtro en el movil
DROP FUNCTION IF EXISTS sp_get_priorities();

CREATE FUNCTION sp_get_priorities()
RETURNS TABLE (
    code        VARCHAR(20),
    name        VARCHAR(50),
    sort_order  SMALLINT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT p.code, p.name, p.sort_order
    FROM priorities p
    ORDER BY p.sort_order ASC;
END;
$$;

DROP FUNCTION IF EXISTS sp_get_statuses();

CREATE FUNCTION sp_get_statuses()
RETURNS TABLE (
    code        VARCHAR(20),
    name        VARCHAR(50),
    sort_order  SMALLINT
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
    RETURN QUERY
    SELECT s.code, s.name, s.sort_order
    FROM statuses s
    ORDER BY s.sort_order ASC;
END;
$$;
