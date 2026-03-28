-- ─────────────────────────────────────────────────────────────
-- Supabase SQL Schema
-- Run this in your Supabase SQL Editor to create the products table
-- ─────────────────────────────────────────────────────────────

-- Enable uuid extension (already enabled by default on Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id         UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT        NOT NULL,
  price      NUMERIC     NOT NULL CHECK (price >= 0),
  image_url  TEXT,
  category   TEXT        DEFAULT 'Geral',
  stock      INTEGER     NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Se você já tem a tabela products criada, rode APENAS o comando abaixo para adicionar a coluna:
-- ALTER TABLE products ADD COLUMN category TEXT DEFAULT 'Geral';

-- ─── Row Level Security ───────────────────────────────────────
-- Enable RLS (required by Supabase)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anonymous users can browse products)
CREATE POLICY "Allow public read access"
  ON products FOR SELECT
  USING (true);

-- Allow all operations (since no auth is required for this app)
-- In production, restrict INSERT/UPDATE/DELETE to authenticated admins
CREATE POLICY "Allow all operations"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);

-- ─── Sample Data ──────────────────────────────────────────────
INSERT INTO products (name, price, image_url, stock) VALUES
  ('Camiseta Premium Preta', 79.90,  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400', 15),
  ('Tênis Esportivo Azul',   299.90, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',  8),
  ('Mochila Urbana',         189.90, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',  0),
  ('Óculos de Sol Retrô',    149.99, 'https://images.unsplash.com/photo-1625591341337-13787c1e7b16?w=400', 20),
  ('Boné Minimalista',        59.90, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400', 5),
  ('Relógio Clássico',       399.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 3);
