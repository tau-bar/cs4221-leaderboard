import { StudentDto } from "./student/dto/student.dto";

export class SubmitResponseDto {
    readonly student_id: string;
    readonly question_id: number;
    readonly submission_time: Date;
    readonly query: string;
    readonly status: string;
}

export class SubmitDto {
    readonly student_id: string;
    readonly student_name: string;
    readonly student_email: string;
    readonly question_id: number;
    readonly query: string;
}