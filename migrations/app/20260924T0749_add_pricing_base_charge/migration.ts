#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/84e761eeb0b2b7c3e9f43ebed2c65ff08a4fdc17ab8f230f6d1704a078ea57ff/contract';
import endContract from '../../snapshots/84e761eeb0b2b7c3e9f43ebed2c65ff08a4fdc17ab8f230f6d1704a078ea57ff/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/951e5998712db6ff0b2940860a3b60b2abc3a7d16ea837c92d7de8d05bc2b6df/contract';
import startContract from '../../snapshots/951e5998712db6ff0b2940860a3b60b2abc3a7d16ea837c92d7de8d05bc2b6df/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'pricing',
        column: col('baseCharge', 'numeric', { codecRef: { codecId: 'pg/numeric@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'pricing',
        column: col('currency', 'text', {
          notNull: true,
          default: lit('LKR'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
