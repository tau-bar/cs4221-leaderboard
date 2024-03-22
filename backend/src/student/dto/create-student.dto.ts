import { OmitType } from "@nestjs/mapped-types";
import { StudentDto } from "./student.dto";

export class CreateStudentDto extends OmitType(StudentDto, ['id']) {}
