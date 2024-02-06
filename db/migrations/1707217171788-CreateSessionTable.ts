import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateSessionTable1707217171788 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sessions',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            length: '255',
            isPrimary: true,
          },
          {
            name: 'expiredAt',
            type: 'bigint',
          },
          {
            name: 'json',
            type: 'text',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
            default: null,
          },
        ],
      }),
      true,
    );

    // Adding an index if needed
    await queryRunner.createIndex(
      'sessions',
      new TableIndex({
        name: 'IDX_EXPIRED_AT',
        columnNames: ['expiredAt'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sessions');
  }
}
