CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE te  am_role AS ENUM ('admin', 'member');
CREATE TYPE project_status AS ENUM ('active', 'archived');
CREATE TYPE task_status AS ENUM ('todo', 'doing', 'done');

CREATE TABLE users(
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE team(
    team_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    lead_id UUID NOT NULL REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(name)
);

CREATE TABLE team_members(
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES team(team_id) ON DELETE CASCADE,
    role team_role NOT NULL DEFAULT 'member',
    PRIMARY KEY (user_id, team_id)
);

CREATE TABLE projects(
    project_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES team(team_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    status project_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (team_id, name)
);

CREATE TABLE tasks(
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    status task_status NOT NULL DEFAULT 'todo',
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


---------------------------------------------- Sample Data Insertion

INSERT INTO users (name, email, password_hash)
SELECT
    'user_' || i,
    'user_' || i || '@example.com',
    'hash_' || i
FROM generate_series(1, 20) i;

INSERT INTO team (name, lead_id)
SELECT
    'Team_' || i,
    (SELECT user_id FROM users ORDER BY random() LIMIT 1)
FROM generate_series(1, 5) i;


INSERT INTO team_members (user_id, team_id, role)
SELECT
    u.user_id,
    t.team_id,
    (CASE 
        WHEN random() < 0.2 THEN 'admin'
        ELSE 'member'
    END)::team_role
FROM users u
CROSS JOIN team t
WHERE random() < 0.4
ON CONFLICT DO NOTHING;


INSERT INTO projects (team_id, name, status)
SELECT
    t.team_id,
    'Project_' || i,
    ( CASE 
        WHEN random() < 0.8 THEN 'active'
        ELSE 'archived'
    END )::project_status
FROM team t
CROSS JOIN generate_series(1, 5) i;


INSERT INTO tasks (project_id, title, status, due_date)
SELECT
    p.project_id,
    'Task_' || i,
    (ARRAY['todo','doing','done'])[floor(random()*3)+1]::task_status,
    CURRENT_DATE + (floor(random()*30))::int
FROM projects p
CROSS JOIN generate_series(1, 10) i;