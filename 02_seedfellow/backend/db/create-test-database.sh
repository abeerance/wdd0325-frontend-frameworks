#!/bin/sh
# Runs once, the first time the database volume is created.
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<SQL
  CREATE DATABASE seedfellow_test OWNER $POSTGRES_USER;
SQL
