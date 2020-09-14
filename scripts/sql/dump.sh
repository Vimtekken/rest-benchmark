#!/bin/sh
echo "SET search_path TO public;" > docker-dev/postgres/initdb/01_raw.sql
docker exec postgres pg_dump -s --user postgres bench | grep -v search_path >> src/postgres/initdb/01_raw.sql
