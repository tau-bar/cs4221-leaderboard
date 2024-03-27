import { Question } from "src/question/entities/question.entity";
import { Student } from "src/student/entities/student.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity({ schema: "admin", name: "submission" })
export class Submission {
    @PrimaryColumn({ type: "int8" })
    student_id: number;

    @PrimaryColumn({ type: "int8" })
    question_id: number;

    @PrimaryColumn({ type: "timestamptz", precision: 3, default: () => "CURRENT_TIMESTAMP(3)" })
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
    @JoinColumn({ name: "student_id", referencedColumnName: "id" })
    student: Student;

    @ManyToOne(() => Question, (question) => question.id, { nullable: false, eager: false, cascade: false })
    @JoinColumn({ name: "question_id", referencedColumnName: "id" })
    question: Question;
}
