import { PartialType } from "@nestjs/mapped-types";
import { StudentDto } from "./student.dto";

export class UpdateStudentDto extends PartialType(StudentDto) {}
