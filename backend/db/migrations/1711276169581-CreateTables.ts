import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1711276169581 implements MigrationInterface {
    name = 'CreateTables1711276169581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "admin"."student" ("id" BIGSERIAL NOT NULL, "name" text NOT NULL, "email" text NOT NULL, CONSTRAINT "UQ_a56c051c91dbe1068ad683f536e" UNIQUE ("email"), CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "admin"."question" ("id" BIGSERIAL NOT NULL, "description" text NOT NULL, "question_schema" text NOT NULL, "question_data" text NOT NULL, "answer_data" text NOT NULL, "max_timeout" bigint NOT NULL, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "admin"."question"`);
        await queryRunner.query(`DROP TABLE "admin"."student"`);
    }
}
