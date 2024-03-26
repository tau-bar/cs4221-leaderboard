import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1711443166772 implements MigrationInterface {
    name = 'CreateTables1711443166772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin"."question" ("id" BIGSERIAL NOT NULL, "description" text NOT NULL, "question_schema" text NOT NULL, "question_data" text NOT NULL, "answer_data" text NOT NULL, "max_timeout" bigint NOT NULL, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin"."student" ("id" BIGSERIAL NOT NULL, "name" text NOT NULL, "email" text NOT NULL, CONSTRAINT "UQ_a56c051c91dbe1068ad683f536e" UNIQUE ("email"), CONSTRAINT "PK_3d8016e1cb58429474a3c041904" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin"."submission" ("student_id" bigint NOT NULL, "question_id" bigint NOT NULL, "submission_time" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT ('now'::text)::timestamp(3) with time zone, "is_correct" boolean NOT NULL DEFAULT false, "planning_time" numeric NOT NULL, "execution_time" numeric NOT NULL, "query" text NOT NULL, "status" text NOT NULL, CONSTRAINT "PK_646eca9c3f7dc4cd1bcda8f22c7" PRIMARY KEY ("student_id", "question_id", "submission_time"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "admin"."submission"`);
        await queryRunner.query(`DROP TABLE "admin"."student"`);
        await queryRunner.query(`DROP TABLE "admin"."question"`);
    }

}
