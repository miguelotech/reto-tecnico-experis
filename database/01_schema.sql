-- esquema de la base. idempotente: se puede correr varias veces sin perder datos.

CREATE TABLE IF NOT EXISTS priorities (
    id          SMALLINT     PRIMARY KEY,
    code        VARCHAR(20)  NOT NULL UNIQUE,
    name        VARCHAR(50)  NOT NULL,
    sort_order  SMALLINT     NOT NULL
);

CREATE TABLE IF NOT EXISTS statuses (
    id          SMALLINT     PRIMARY KEY,
    code        VARCHAR(20)  NOT NULL UNIQUE,
    name        VARCHAR(50)  NOT NULL,
    sort_order  SMALLINT     NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    title        VARCHAR(200)  NOT NULL,
    description  TEXT          NULL,
    priority_id  SMALLINT      NOT NULL REFERENCES priorities (id),
    status_id    SMALLINT      NOT NULL REFERENCES statuses  (id),
    due_date     TIMESTAMPTZ   NULL,
    created_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),

    CONSTRAINT ck_tasks_title_not_blank CHECK (btrim(title) <> '')
);

-- con 18 filas no hacen falta, estan por como va a crecer la tabla:
-- el listado siempre filtra por estado y/o prioridad y ordena por fecha.
CREATE INDEX IF NOT EXISTS ix_tasks_status_priority ON tasks (status_id, priority_id);
CREATE INDEX IF NOT EXISTS ix_tasks_created_at ON tasks (created_at DESC);
