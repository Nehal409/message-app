import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndChatSchema1706521564530
  implements MigrationInterface
{
  name = 'CreateUserAndChatSchema1706521564530';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`username\` varchar(25) NOT NULL, \`phone\` varchar(20) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE INDEX \`IDX_8e1f623798118e629b46a9e629\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`chat\` (\`id\` varchar(36) NOT NULL, \`messageContent\` varchar(500) NOT NULL, \`isDeletedBySender\` tinyint NOT NULL DEFAULT 0, \`isDeletedByReceiver\` tinyint NOT NULL DEFAULT 0, \`isDeletedForEveryone\` timestamp(6) NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`senderId\` varchar(36) NULL, \`receiverId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_c2b21d8086193c56faafaf1b97c\` FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_580acbf39bdd5ec33812685e22b\` FOREIGN KEY (\`receiverId\`) REFERENCES \`user\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_580acbf39bdd5ec33812685e22b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_c2b21d8086193c56faafaf1b97c\``,
    );
    await queryRunner.query(`DROP TABLE \`chat\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8e1f623798118e629b46a9e629\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
