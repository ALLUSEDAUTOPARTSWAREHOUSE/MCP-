// Database schema for authentication
// Run these SQL commands in your Neon database to set up the auth tables

export const createAuthTables = `
-- Users table
CREATE TABLE IF NOT EXISTS public."users" (
  "id" text PRIMARY KEY NOT NULL,
  "email" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "password_hash" text NOT NULL,
  "email_verified" boolean NOT NULL DEFAULT false,
  "email_verified_at" timestamp,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS public."email_verifications" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES public."users"("id") ON DELETE CASCADE,
  "token" text NOT NULL UNIQUE,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Sessions
CREATE TABLE IF NOT EXISTS public."sessions" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL REFERENCES public."users"("id") ON DELETE CASCADE,
  "token" text NOT NULL UNIQUE,
  "expires_at" timestamp NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON public."email_verifications"("user_id");
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON public."email_verifications"("token");
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public."sessions"("user_id");
CREATE INDEX IF NOT EXISTS idx_sessions_token ON public."sessions"("token");
`;
