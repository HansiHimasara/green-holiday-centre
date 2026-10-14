#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/66dbaa1688e43f90f4ef11cf9b62a87b013bbf62565b9a7ae56a6739f43e5b27/contract';
import endContract from '../../snapshots/66dbaa1688e43f90f4ef11cf9b62a87b013bbf62565b9a7ae56a6739f43e5b27/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/846442d531712d625d251dfffc02954ab3503641cf5f4c0ad48a2d684b32db60/contract';
import startContract from '../../snapshots/846442d531712d625d251dfffc02954ab3503641cf5f4c0ad48a2d684b32db60/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'booking',
        column: col('customerEmail', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'booking',
        column: col('customerNationality', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'booking',
        column: col('customerPhone', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
