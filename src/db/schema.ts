import { pgTable, serial, text, timestamp, boolean, integer, numeric, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('admin').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull().unique(),
  email: text('email'),
  notes: text('notes'),
  appointmentsCount: integer('appointments_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  durationMinutes: integer('duration_minutes').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  image: text('image').notNull(),
  category: text('category').default('Esportiva').notNull(),
  status: boolean('status').default(true).notNull(),
  featured: boolean('featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').references(() => clients.id).notNull(),
  serviceId: integer('service_id').references(() => services.id).notNull(),
  appointmentDate: date('appointment_date').notNull(), // 'YYYY-MM-DD'
  appointmentTime: text('appointment_time').notNull(), // '14:00'
  durationMinutes: integer('duration_minutes').notNull(),
  careType: text('care_type').default('studio').notNull(), // 'studio' | 'domiciliar'
  clientName: text('client_name').notNull(),
  clientPhone: text('client_phone').notNull(),
  observations: text('observations'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('confirmed').notNull(), // 'confirmed' | 'completed' | 'cancelled'
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  siteName: text('site_name').notNull().default('Crislan Massoterapeuta'),
  ownerName: text('owner_name').notNull().default('Crislan'),
  whatsappNumber: text('whatsapp_number').notNull().default('5511999999999'),
  instagramHandle: text('instagram_handle').notNull().default('crislanmassoterapeuta'),
  address: text('address').notNull().default('Rua das Olimpíadas, 200 - Vila Olímpia, São Paulo - SP'),
  googleMapsUrl: text('google_maps_url').notNull().default('https://maps.google.com'),
  businessHourStart: text('business_hour_start').notNull().default('08:00'),
  businessHourEnd: text('business_hour_end').notNull().default('19:00'),
  lunchHourStart: text('lunch_hour_start').notNull().default('12:00'),
  lunchHourEnd: text('lunch_hour_end').notNull().default('13:30'),
  sundaysOpen: boolean('sundays_open').notNull().default(false),
  autoMessageText: text('auto_message_text').notNull().default('Olá! Seu agendamento com Crislan Massoterapeuta foi recebido com sucesso. Nos vemos no horário marcado!'),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const blockedDates = pgTable('blocked_dates', {
  id: serial('id').primaryKey(),
  blockedDate: date('blocked_date').notNull().unique(), // 'YYYY-MM-DD'
  reason: text('reason').notNull().default('Férias / Indisponível'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const blockedHours = pgTable('blocked_hours', {
  id: serial('id').primaryKey(),
  specificDate: date('specific_date'), // Optional: if null, applies to all days
  hour: text('hour').notNull(), // e.g. '10:00'
  reason: text('reason').default('Bloqueio manual'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  clientName: text('client_name').notNull(),
  roleOrSport: text('role_or_sport').notNull(),
  content: text('content').notNull(),
  rating: integer('rating').default(5).notNull(),
  image: text('image'),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const gallery = pgTable('gallery', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  category: text('category').default('Atendimento').notNull(),
  active: boolean('active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const logs = pgTable('logs', {
  id: serial('id').primaryKey(),
  action: text('action').notNull(),
  details: text('details'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});
