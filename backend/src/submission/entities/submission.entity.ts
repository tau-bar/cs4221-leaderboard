import { Question } from "src/question/entities/question.entity";
import { Student } from "src/student/entities/student.entity";
import { Column, CreateDateColumn, ManyToOne, PrimaryColumn } from "typeorm";

export class Submission {
    @PrimaryColumn({ type: "int8" })
    student_id: number;

    @PrimaryColumn({ type: "int8" })
    question_id: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    submission_time: Date;

    @Column("bool", { nullable: false, default: false })
    is_correct: boolean;

    @Column("numeric", { nullable: false })
    planning_time: number;

    @Column("numeric", { nullable: false })
    execution_time: number;

    @Column("text", { nullable: false })
    query: string;

    @Column("text", { nullable: false })
    status: string;

    @ManyToOne(() => Student, (student) => student.id, { nullable: false, eager: false, cascade: false })
    student: Student;

    @ManyToOne(() => Question, (question) => question.id, { nullable: false, eager: false, cascade: false })
    question: Question;
}
