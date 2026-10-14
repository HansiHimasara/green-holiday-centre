#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1f00b5012c10f3d45bcc5a18c5150f7612b1484a31d63b496409fae462634271/contract';
import endContract from '../../snapshots/1f00b5012c10f3d45bcc5a18c5150f7612b1484a31d63b496409fae462634271/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/338e3b0eb347812714f2b5a02870a37ad22ecbb6da5f3a36cb5eccbd69ab19b9/contract';
import startContract from '../../snapshots/338e3b0eb347812714f2b5a02870a37ad22ecbb6da5f3a36cb5eccbd69ab19b9/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'booking',
        column: col('idempotencyKey', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'booking',
        constraint: 'booking_idempotencyKey_key',
        columns: ['idempotencyKey'],
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
