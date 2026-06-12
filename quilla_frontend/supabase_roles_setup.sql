-- ======== ACTUALIZACION DE TABLA PERFILES ========

-- 1. Agregar las nuevas columnas a la tabla existente para que Admin pueda ver info
ALTER TABLE IF EXISTS public.perfiles
ADD COLUMN IF NOT EXISTS nombre varchar,
ADD COLUMN IF NOT EXISTS email varchar,
ADD COLUMN IF NOT EXISTS avatar varchar;

-- Si por alguna razon la tabla no existe aun:
CREATE TABLE IF NOT EXISTS public.perfiles (
  id uuid references auth.users(id) not null primary key,
  rol text not null default 'usuario' check (rol in ('publico', 'usuario', 'administrador', 'guia')),
  nombre varchar,
  email varchar,
  avatar varchar,
  created_at timestamp with time zone default now()
);

-- Habilitar RLS (si no estaba habilitado)
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- Evitamos que puedan editar sus propios roles para fines de seguridad (solo admin o scripts del sistema)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.perfiles;
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.perfiles FOR SELECT
  USING ( true );

-- Permitir a los admins modificar roles, asumiendo su rol en JWT si fuese necesario 
-- (O mas sencillo, permitir que cliente maneje la logica por RLS general y proteger por UI, pero 
-- para hacerlo estricto, desactivamos RLS para UPDATE usando auth.uid en supabase)
DROP POLICY IF EXISTS "Allow Admins to Update" ON public.perfiles;
CREATE POLICY "Allow Admins to Update" 
  ON public.perfiles FOR UPDATE 
  USING ( (SELECT rol FROM public.perfiles WHERE id = auth.uid()) = 'administrador' );

-- 2. Actualizar el Trigger para automatizar el ingreso de nombre, email, avatar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.perfiles (id, rol, nombre, email, avatar)
  VALUES (
    new.id, 
    'usuario', 
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Rellenar los perfiles antiguos si es que el trigger falló y extraer data del metadata
-- ¡Este comando actualiza a todos los usuarios con su data desde auth.users a la public!
UPDATE public.perfiles AS p
SET 
    nombre = u.raw_user_meta_data->>'full_name',
    email = u.email,
    avatar = u.raw_user_meta_data->>'avatar_url'
FROM auth.users AS u
WHERE p.id = u.id;
