import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "admin.question" })
export class Question {
    @PrimaryGeneratedColumn({ type: "int8" })
    id: number;

    @Column("text", { nullable: false })
    description: string;

    @Column("text", { nullable: false })
    question_schema: string;

    @Column("text", { nullable: false })
    question_data: string;

    @Column("text", { nullable: false })
    answer_data: string;

    @Column("int8", { nullable: false })
    max_timeout: number;
}
