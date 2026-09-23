#!/usr/bin/env -S node

import type { Contract as End } from '../../snapshots/951e5998712db6ff0b2940860a3b60b2abc3a7d16ea837c92d7de8d05bc2b6df/contract';

import endContract from '../../snapshots/951e5998712db6ff0b2940860a3b60b2abc3a7d16ea837c92d7de8d05bc2b6df/contract.json' with { type: 'json' };

import type { Contract as Start } from '../../snapshots/d580a659678091c6a1cd9800d94e9fe83d463cb59b9ca7412d0b681f50063379/contract';

import startContract from '../../snapshots/d580a659678091c6a1cd9800d94e9fe83d463cb59b9ca7412d0b681f50063379/contract.json' with { type: 'json' };

import {
  Migration,
  MigrationCLI,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      // =====================================================
      // PASSWORD RESET TOKEN TABLE
      // =====================================================

      this.createTable({
        schema: 'public',
        table: 'passwordResetToken',

        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),

          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),

          col('id', 'SERIAL', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),

          col('tokenHash', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),

          col('usedAt', 'timestamptz', {
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),

          col('userId', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],

        constraints: [primaryKey(['id'])],
      }),

      // =====================================================
      // SESSION TABLE
      // =====================================================

      this.createTable({
        schema: 'public',
        table: 'session',

        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),

          col('expiresAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-string@1' },
          }),

          col('id', 'SERIAL', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),

          col('tokenHash', 'text', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1' },
          }),

          col('userId', 'int4', {
            notNull: true,
            codecRef: { codecId: 'pg/int4@1' },
          }),
        ],

        constraints: [primaryKey(['id'])],
      }),

      // =====================================================
      // CONTACT MESSAGE
      // =====================================================

      this.addColumn({
        schema: 'public',
        table: 'contactMessage',

        column: col('readAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'contactMessage',

        column: col('repliedAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),

      // =====================================================
      // FEEDBACK
      // =====================================================

      this.addColumn({
        schema: 'public',
        table: 'feedback',

        column: col('email', 'text', {
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'feedback',

        column: col('fullName', 'text', {
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),

      // feedback table is empty, so no backfill is required
      this.setNotNull({
        schema: 'public',
        table: 'feedback',
        column: 'fullName',
      }),

      // Booking reference is optional for feedback
      this.dropNotNull({
        schema: 'public',
        table: 'feedback',
        column: 'bookingId',
      }),

      this.dropNotNull({
        schema: 'public',
        table: 'feedback',
        column: 'customerId',
      }),

      // =====================================================
      // USER / ADMIN
      // =====================================================

      this.addColumn({
        schema: 'public',
        table: 'user',

        column: col('lastLoginAt', 'timestamptz', {
          codecRef: { codecId: 'pg/timestamptz-string@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'user',

        column: col('status', 'text', {
          notNull: true,
          default: lit('ACTIVE'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'user',

        column: col('username', 'text', {
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),

      // =====================================================
      // VEHICLE TYPE
      // Existing vehicle rows remain safe
      // =====================================================

      this.addColumn({
        schema: 'public',
        table: 'vehicleType',

        column: col('airConditioning', 'bool', {
          notNull: true,
          default: lit(true),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'vehicleType',

        column: col('chauffeurIncluded', 'bool', {
          notNull: true,
          default: lit(true),
          codecRef: { codecId: 'pg/bool@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'vehicleType',

        column: col('chauffeurLanguage', 'text', {
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'vehicleType',

        column: col('fuelType', 'text', {
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),

      this.addColumn({
        schema: 'public',
        table: 'vehicleType',

        column: col('transmission', 'text', {
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),

      // =====================================================
      // BOOKING
      // booking table is empty, so travelDate can safely
      // become required
      // =====================================================

      this.setNotNull({
        schema: 'public',
        table: 'booking',
        column: 'travelDate',
      }),

      // =====================================================
      // UNIQUE CONSTRAINTS
      // =====================================================

      this.addUnique({
        schema: 'public',
        table: 'passwordResetToken',
        constraint: 'passwordResetToken_tokenHash_key',
        columns: ['tokenHash'],
      }),

      this.addUnique({
        schema: 'public',
        table: 'session',
        constraint: 'session_tokenHash_key',
        columns: ['tokenHash'],
      }),

      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_username_key',
        columns: ['username'],
      }),

      // =====================================================
      // USER STATUS CHECK
      // =====================================================

      this.addCheckConstraint({
        schema: 'public',
        table: 'user',
        constraint: 'user_status_check_56c81764',
        expression: `"status" IN ('ACTIVE', 'DISABLED')`,
      }),

      // =====================================================
      // INDEXES
      // =====================================================

      this.createIndex({
        schema: 'public',
        table: 'passwordResetToken',
        index: 'passwordResetToken_userId_idx_a489d58a',
        columns: ['userId'],
      }),

      this.createIndex({
        schema: 'public',
        table: 'session',
        index: 'session_userId_idx_a489d58a',
        columns: ['userId'],
      }),

      // =====================================================
      // FOREIGN KEYS
      // =====================================================

      this.addForeignKey({
        schema: 'public',
        table: 'passwordResetToken',

        foreignKey: {
          name: 'passwordResetToken_userId_fkey',
          columns: ['userId'],

          references: {
            schema: 'public',
            table: 'user',
            columns: ['id'],
          },

          onDelete: 'cascade',
        },
      }),

      this.addForeignKey({
        schema: 'public',
        table: 'session',

        foreignKey: {
          name: 'session_userId_fkey',
          columns: ['userId'],

          references: {
            schema: 'public',
            table: 'user',
            columns: ['id'],
          },

          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);