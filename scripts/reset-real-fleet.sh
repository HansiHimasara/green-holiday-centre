#!/usr/bin/env bash
set -euo pipefail
umask 077
mode="${1:---preview}"
if [[ "$mode" != "--preview" && "$mode" != "--apply" ]]; then
  echo "Usage: bash scripts/reset-real-fleet.sh [--preview|--apply]" >&2; exit 2
fi
: "${DATABASE_URL:?Set DATABASE_URL to the intended production PostgreSQL connection first}"
command -v psql >/dev/null || { echo "Install PostgreSQL client tools (psql, pg_dump, pg_restore)." >&2; exit 1; }
# PGDATABASE accepts a connection URI; keep credentials out of process arguments.
export PGDATABASE="$DATABASE_URL"
unset DATABASE_URL
psql -X -v ON_ERROR_STOP=1 <<'SQL'
SELECT current_database() AS database, current_user AS role;
SELECT 'user (preserved)' AS table_name, count(*) FROM public."user"
UNION ALL SELECT 'vehicleType', count(*) FROM public."vehicleType"
UNION ALL SELECT 'booking', count(*) FROM public."booking"
UNION ALL SELECT 'customer', count(*) FROM public."customer"
UNION ALL SELECT 'payment', count(*) FROM public."payment"
UNION ALL SELECT 'feedback', count(*) FROM public."feedback"
UNION ALL SELECT 'pricing', count(*) FROM public."pricing"
UNION ALL SELECT 'bookingDestination', count(*) FROM public."bookingDestination"
UNION ALL SELECT 'contactMessage', count(*) FROM public."contactMessage"
UNION ALL SELECT 'session', count(*) FROM public."session"
UNION ALL SELECT 'passwordResetToken', count(*) FROM public."passwordResetToken";
SQL
if [[ "$mode" == "--preview" ]]; then
  echo "Preview only. No rows changed. Apply will delete ALL data in the ten listed application tables except user, then insert four vehicles."
  exit 0
fi
command -v pg_dump >/dev/null
command -v pg_restore >/dev/null
script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
for name in sedan-car benz-vito flat-roof mini-coach; do
  test -s "$script_dir/../public/images/vehicles/$name.png" || { echo "Missing fleet image: $name" >&2; exit 1; }
done
backup_dir="${FLEET_BACKUP_DIR:-$HOME/green-holiday-db-backups}"
mkdir -p "$backup_dir"
backup="$(mktemp "$backup_dir/before-real-fleet-$(date -u +%Y%m%dT%H%M%SZ)-XXXXXX")"
echo "Creating private full database backup: $backup"
if ! pg_dump --format=custom --file="$backup"; then
  echo "Backup failed. Database has NOT been reset." >&2; exit 1
fi
pg_restore --list "$backup" >/dev/null
psql -X -v ON_ERROR_STOP=1 --file="$script_dir/reset-real-fleet.sql"
echo "Completed. User accounts retained; old sessions invalidated. Backup: $backup"
