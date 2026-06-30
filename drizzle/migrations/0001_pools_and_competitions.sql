CREATE TABLE IF NOT EXISTS "competitions" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "source" text NOT NULL,
  "external_id" text,
  "season" text,
  "status" text DEFAULT 'active' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "pools" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "creator_id" uuid NOT NULL,
  "competition_id" uuid NOT NULL,
  "name" text DEFAULT '' NOT NULL,
  "description" text,
  "slug_token" text NOT NULL,
  "status" text DEFAULT 'DRAFT' NOT NULL,
  "rules_json" jsonb DEFAULT '{"modes":{"exactScore":true,"result":false,"tournamentExtras":false},"points":{"exactScore":5,"result":3,"champion":10,"topScorer":10},"tiebreaker":"most_exact_scores"}'::jsonb NOT NULL,
  "started_at" timestamp with time zone,
  "archived_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "pools_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action,
  CONSTRAINT "pools_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE no action ON UPDATE no action,
  CONSTRAINT "pools_slug_token_unique" UNIQUE("slug_token")
);

CREATE TABLE IF NOT EXISTS "pool_members" (
  "pool_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "joined_at" timestamp with time zone DEFAULT now() NOT NULL,
  "left_at" timestamp with time zone,
  CONSTRAINT "pool_members_pool_id_user_id_pk" PRIMARY KEY("pool_id","user_id"),
  CONSTRAINT "pool_members_pool_id_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "public"."pools"("id") ON DELETE cascade ON UPDATE no action,
  CONSTRAINT "pool_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action
);

INSERT INTO "competitions" ("id", "name", "source", "external_id", "season", "status")
VALUES
  ('a0000000-0000-4000-8000-000000000001', 'Brasileirão Série A', 'api', '2013', '2026', 'active'),
  ('a0000000-0000-4000-8000-000000000002', 'Copa do Mundo', 'api', '2000', '2026', 'active')
ON CONFLICT DO NOTHING;
