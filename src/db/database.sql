-- ==========================================
-- CRISLAN MASSOTERAPIA
-- DATABASE.SQL
-- PostgreSQL / Supabase
-- ==========================================

-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CLIENTS
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    email TEXT,
    notes TEXT,
    appointments_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SERVICES
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Esportiva',
    status BOOLEAN NOT NULL DEFAULT TRUE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- APPOINTMENTS
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,

    client_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,

    appointment_date DATE NOT NULL,
    appointment_time TEXT NOT NULL,

    duration_minutes INTEGER NOT NULL,

    care_type TEXT NOT NULL DEFAULT 'studio',

    client_name TEXT NOT NULL,

    client_phone TEXT NOT NULL,

    observations TEXT,

    price NUMERIC(10,2) NOT NULL,

    status TEXT NOT NULL DEFAULT 'confirmed',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_client
        FOREIGN KEY (client_id)
        REFERENCES clients(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_service
        FOREIGN KEY (service_id)
        REFERENCES services(id)
        ON DELETE CASCADE
);

-- SETTINGS
CREATE TABLE settings (

    id SERIAL PRIMARY KEY,

    site_name TEXT NOT NULL DEFAULT 'Crislan Massoterapeuta',

    owner_name TEXT NOT NULL DEFAULT 'Crislan',

    whatsapp_number TEXT NOT NULL DEFAULT '5511999999999',

    instagram_handle TEXT NOT NULL DEFAULT 'crislanmassoterapeuta',

    address TEXT NOT NULL DEFAULT 'Rua das Olimpíadas, 200 - Vila Olímpia, São Paulo - SP',

    google_maps_url TEXT NOT NULL DEFAULT 'https://maps.google.com',

    business_hour_start TEXT NOT NULL DEFAULT '08:00',

    business_hour_end TEXT NOT NULL DEFAULT '19:00',

    lunch_hour_start TEXT NOT NULL DEFAULT '12:00',

    lunch_hour_end TEXT NOT NULL DEFAULT '13:30',

    sundays_open BOOLEAN NOT NULL DEFAULT FALSE,

    auto_message_text TEXT NOT NULL DEFAULT
'Olá! Seu agendamento com Crislan Massoterapeuta foi recebido com sucesso. Nos vemos no horário marcado!',

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- BLOCKED DATES
CREATE TABLE blocked_dates (

    id SERIAL PRIMARY KEY,

    blocked_date DATE NOT NULL UNIQUE,

    reason TEXT NOT NULL DEFAULT 'Férias / Indisponível',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- BLOCKED HOURS
CREATE TABLE blocked_hours (

    id SERIAL PRIMARY KEY,

    specific_date DATE,

    hour TEXT NOT NULL,

    reason TEXT DEFAULT 'Bloqueio manual',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TESTIMONIALS
CREATE TABLE testimonials (

    id SERIAL PRIMARY KEY,

    client_name TEXT NOT NULL,

    role_or_sport TEXT NOT NULL,

    content TEXT NOT NULL,

    rating INTEGER NOT NULL DEFAULT 5,

    image TEXT,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- GALLERY
CREATE TABLE gallery (

    id SERIAL PRIMARY KEY,

    title TEXT NOT NULL,

    image_url TEXT NOT NULL,

    category TEXT NOT NULL DEFAULT 'Atendimento',

    active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- LOGS
CREATE TABLE logs (

    id SERIAL PRIMARY KEY,

    action TEXT NOT NULL,

    details TEXT,

    ip_address TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

---------------------------------------------------
-- INDEXES
---------------------------------------------------

CREATE INDEX idx_clients_phone
ON clients(phone);

CREATE INDEX idx_services_slug
ON services(slug);

CREATE INDEX idx_appointments_date
ON appointments(appointment_date);

CREATE INDEX idx_appointments_status
ON appointments(status);

CREATE INDEX idx_logs_created
ON logs(created_at);

---------------------------------------------------
-- CONFIGURAÇÃO PADRÃO
---------------------------------------------------

INSERT INTO settings (
    site_name,
    owner_name,
    whatsapp_number,
    instagram_handle
)
VALUES (
    'Crislan Massoterapeuta',
    'Crislan',
    '5511999999999',
    'crislanmassoterapeuta'
);