import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTimeInRound1749323684560 implements MigrationInterface {
    name = 'RemoveTimeInRound1749323684560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fights" DROP COLUMN "timeInRound"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fights" ADD "timeInRound" interval`);
    }

}
