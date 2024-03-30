import { OmitType } from "@nestjs/mapped-types";
import { QuestionDto } from "./question.dto";

export class CreateQuestionDto extends OmitType(QuestionDto, ['id']) { }
