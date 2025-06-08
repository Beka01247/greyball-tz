import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1749384340186 implements MigrationInterface {
    name = 'Initial1749384340186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "fighters" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(60) NOT NULL, "lastName" character varying(60) NOT NULL, "nickname" character varying(60), "birthDate" date, "country" character varying(60), "heightCm" integer, "reachCm" integer, "weightClass" character varying(30) NOT NULL, "isRetired" boolean NOT NULL DEFAULT false, "wins" integer NOT NULL DEFAULT '0', "losses" integer NOT NULL DEFAULT '0', "draws" integer NOT NULL DEFAULT '0', "knockouts" integer NOT NULL DEFAULT '0', "submissions" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_181eba8698d5defe223daa78fba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "rankings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fighterId" uuid NOT NULL, "weightClass" character varying(30) NOT NULL, "position" integer NOT NULL, "points" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_05d87d598d485338c9980373d20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "location" character varying(100) NOT NULL, "date" TIMESTAMP NOT NULL, "isFinished" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."fights_result_enum" AS ENUM('DECISION', 'KO', 'TKO', 'SUBMISSION', 'DQ', 'NO_CONTEST')`);
        await queryRunner.query(`CREATE TABLE "fights" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "eventId" uuid NOT NULL, "fighter1Id" uuid NOT NULL, "fighter2Id" uuid NOT NULL, "winnerId" uuid, "result" "public"."fights_result_enum", "roundEnded" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f58a76631bc2c2bdef2a8628c95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rankings" ADD CONSTRAINT "FK_97fa3b60be070f2bb262b9de34e" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fights" ADD CONSTRAINT "FK_76786f5b3eee0a81261b3ae9c10" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fights" ADD CONSTRAINT "FK_80228c1cbc5834703f25512f1ec" FOREIGN KEY ("fighter1Id") REFERENCES "fighters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fights" ADD CONSTRAINT "FK_0ffc5e2969ed66f848550a6efed" FOREIGN KEY ("fighter2Id") REFERENCES "fighters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "fights" ADD CONSTRAINT "FK_2e81bedfd44fcad0fe6c88ccafa" FOREIGN KEY ("winnerId") REFERENCES "fighters"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "fights" DROP CONSTRAINT "FK_2e81bedfd44fcad0fe6c88ccafa"`);
        await queryRunner.query(`ALTER TABLE "fights" DROP CONSTRAINT "FK_0ffc5e2969ed66f848550a6efed"`);
        await queryRunner.query(`ALTER TABLE "fights" DROP CONSTRAINT "FK_80228c1cbc5834703f25512f1ec"`);
        await queryRunner.query(`ALTER TABLE "fights" DROP CONSTRAINT "FK_76786f5b3eee0a81261b3ae9c10"`);
        await queryRunner.query(`ALTER TABLE "rankings" DROP CONSTRAINT "FK_97fa3b60be070f2bb262b9de34e"`);
        await queryRunner.query(`DROP TABLE "fights"`);
        await queryRunner.query(`DROP TYPE "public"."fights_result_enum"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "rankings"`);
        await queryRunner.query(`DROP TABLE "fighters"`);
    }

}
