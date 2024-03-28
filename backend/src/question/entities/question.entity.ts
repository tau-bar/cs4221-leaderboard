import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ schema: "admin", name: "question" })
export class Question {
    @PrimaryGeneratedColumn({ type: "int8" })
    id: number;

    @Column("text", { nullable: false })
    name: string;

    @Column("text", { nullable: false })
    description: string;

    @Column("text", { nullable: false })
    question_schema: string;

    @Column("text", { nullable: false })
    question_data: string;

    @Column("jsonb", { nullable: false })
    answer_data: any[];

    @Column("int8", { nullable: false })
    max_timeout: number;
}
