-- Identity schema.
CREATE SCHEMA IF NOT EXISTS identity AUTHORIZATION aem;

-- User table for AEM.
CREATE TABLE IF NOT EXISTS identity.user (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email               VARCHAR(255) NOT NULL UNIQUE,
  normalised_email    VARCHAR(255) NOT NULL UNIQUE,
  username            VARCHAR(100) NOT NULL UNIQUE,
  normalised_username VARCHAR(100) NOT NULL UNIQUE,
  password            TEXT NOT NULL,
  created_date        TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);

-- User login table to record log in times.
CREATE TABLE IF NOT EXISTS identity.user_login (
  id                  BIGINT GENERATED ALWAYS AS IDENTITY,
  user_id             BIGINT REFERENCES identity.user(id) ON DELETE CASCADE,
  time                TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT current_timestamp
);