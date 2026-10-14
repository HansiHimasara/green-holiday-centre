#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/338e3b0eb347812714f2b5a02870a37ad22ecbb6da5f3a36cb5eccbd69ab19b9/contract';
import endContract from '../../snapshots/338e3b0eb347812714f2b5a02870a37ad22ecbb6da5f3a36cb5eccbd69ab19b9/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/84e761eeb0b2b7c3e9f43ebed2c65ff08a4fdc17ab8f230f6d1704a078ea57ff/contract';
import startContract from '../../snapshots/84e761eeb0b2b7c3e9f43ebed2c65ff08a4fdc17ab8f230f6d1704a078ea57ff/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'vehicleType',
        column: col('ratePerKm', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
