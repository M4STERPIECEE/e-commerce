-- V2__seed_data.sql
-- Seed initial categories
-- Admin user is created programmatically at startup via AdminUserInitializer (BCrypt hashed)

INSERT INTO categories (id, name, slug, description) VALUES
    (gen_random_uuid(), 'Électronique', 'electronique', 'Appareils et gadgets électroniques'),
    (gen_random_uuid(), 'Vêtements', 'vetements', 'Mode homme et femme'),
    (gen_random_uuid(), 'Maison', 'maison', 'Articles pour la maison et la décoration');
