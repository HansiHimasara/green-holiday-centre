#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/41908f752a303e5eff1c9fa223b63fa3ee6006653758ac28c2de23314c721046/contract';
import endContract from '../../snapshots/41908f752a303e5eff1c9fa223b63fa3ee6006653758ac28c2de23314c721046/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/66dbaa1688e43f90f4ef11cf9b62a87b013bbf62565b9a7ae56a6739f43e5b27/contract';
import startContract from '../../snapshots/66dbaa1688e43f90f4ef11cf9b62a87b013bbf62565b9a7ae56a6739f43e5b27/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'vehicleType',
        column: col('driverBattaPerDayLkr', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
