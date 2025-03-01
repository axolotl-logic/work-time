CREATE TABLE IF NOT EXISTS "perpetual-sprint_announaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"last_pinged_at" timestamp with time zone,
	"pinged_count" integer DEFAULT 0 NOT NULL
);
