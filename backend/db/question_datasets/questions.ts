import { QuestionDto } from "src/question/dto/question.dto";
import * as letour from "./letour";
import * as mondial from "./mondial";
import * as tpcc from "./tpcc";
import * as fs from 'fs';

function convertCsvToText(csvFilePath: string): string {
    const csvData = fs.readFileSync(csvFilePath, 'utf-8');
    const rows = csvData.split('\n');
    const textData = rows.map(row => row.trim()).join('\n');

    return textData;
}

const questions: QuestionDto[] = [
    {
        id: 1,
        description: `The Tour de France is an annual professional road cycling competition held primarily in France, with
        occasional routes passing through neighbouring countries. The competition spans three weeks in July, covering
        a distance exceeding 2,000 miles (3,500 kilometres). Find the average speed in kilometre per hour of each rider.`,
        question_schema: letour.leTourSchema,
        question_data: letour.leTourData,
        answer_data: convertCsvToText("../question_results/q1_ans.csv"),
        max_timeout: 10000
    },
    {
        id: 2,
        description: `The Tour de France is an annual professional road cycling competition held primarily in France, with
        occasional routes passing through neighbouring countries. The competition spans three weeks in July, covering
        a distance exceeding 2,000 miles (3,500 kilometres). On what days were all teams represented in the top 50 stage rankings?`,
        question_schema: letour.leTourSchema,
        question_data: letour.leTourData,
        answer_data: convertCsvToText("../question_results/q2_ans.csv"),
        max_timeout: 10000
    }
];

export default questions