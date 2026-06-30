CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY NOT NULL,
  "email" text NOT NULL UNIQUE,
  "name" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
