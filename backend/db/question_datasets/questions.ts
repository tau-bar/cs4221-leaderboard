import { QuestionDto } from "src/question/dto/question.dto";
import * as fs from 'fs';
import { carpricesData, carpricesSchema } from "./carprices";
import { leTourData, leTourSchema } from "./letour";
import { mondialSchema, mondialData } from "./mondial";
import { tpccSchema, tpccData } from "./tpcc";

async function convertCsvToJsonbText(filePath) {
    try {
        const csv = await fs.promises.readFile(filePath, 'utf-8');
        const lines = csv.replace("\r", "").split("\n");
        const result = [];
        const headers = lines[0].split(",");

        for (let i = 1; i < lines.length - 1; i++) {
            const obj = {};
            const currentline = lines[i].split(",");

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }

            result.push(obj);
        }
        return JSON.stringify(result);
    } catch (error) {
        console.error("Error reading CSV file:", error);
        throw error;
    }
}

async function loadQuestions(): Promise<QuestionDto[]> {
    const questions: QuestionDto[] = [
        {
            id: 1,
            question_name: "Average Speed of Riders",
            schema_name: "letour",
            description: `The Tour de France is an annual professional road cycling competition held primarily in France, with occasional routes passing through neighbouring countries. Find the average speed in kilometre per hour of each rider.`,
            question_schema: leTourSchema,
            question_data: leTourData,
            answer_data: await convertCsvToJsonbText("./db/question_results/q1_ans.csv"),
            sample_answer: `SELECT rr.name, ROUND(SUM(s.length) / SUM((r.time::NUMERIC)
            /3600),2) AS average_speed
            FROM riders rr , results_individual r , stages s
            WHERE r.stage = s.nr AND rr.bib = r.rider
            GROUP BY rr.bib
            ORDER BY SUM(s.length) / SUM((r.time::NUMERIC)
            /3600) DESC;`,
            max_timeout: 1000,
        },
        {
            id: 2,
            question_name: "Representation of Teams in Top 50 Rankings",
            schema_name: "letour",
            description: `The Tour de France is an annual professional road cycling competition held primarily in France, with occasional routes passing through neighbouring countries. On what days were all teams represented in the top 50 stage rankings?`,
            question_schema: leTourSchema,
            question_data: leTourData,
            answer_data: await convertCsvToJsonbText("./db/question_results/q2_ans.csv"),
            sample_answer: `SELECT s.day
            FROM stages s
            WHERE NOT EXISTS (
            SELECT 1 
            FROM teams t
            WHERE NOT EXISTS (
             SELECT 1
             FROM results_individual i, riders r
             WHERE t.name = r.team
             AND r.bib = i.rider
             AND i.rank <= 50
             AND i.stage = s.nr));`,
            max_timeout: 1000,
        },
        {
            id: 3,
            question_name: "Number of Category 3 Mountains per Stage",
            schema_name: "letour",
            description: `The Tour de France is an annual professional road cycling competition held primarily in France, with occasional routes passing through neighbouring countries. For each stage, list the number of mountains in Category 3. If a stage does not have such a mountain, the result should list 0 for this stage. Return the result ordered in increasing stage number and decreasing number of mountains of Category 3.`,
            question_schema: leTourSchema,
            question_data: leTourData,
            answer_data: await convertCsvToJsonbText("./db/question_results/q3_ans.csv"),
            sample_answer: `SELECT s.nr , COUNT(m.stage)
            FROM stages s LEFT OUTER JOIN mountains m ON m.stage = s.nr AND
            CATEGORY = '3'
            GROUP BY s.nr
            ORDER BY s.nr ASC , COUNT(m.stage) DESC;`,
            max_timeout: 1000,
        },
        {
            id: 4,
            question_name: "Population Rank by Continent",
            schema_name: "mondial",
            description: `The MONDIAL Database is a database of geographic and demographic data created in 1998 at Freiburg University and maintained at G¨ottingen University since 2002. Rank the population of each country by continent and globally, listing them in descending order.`,
            question_schema: mondialSchema,
            question_data: mondialData,
            answer_data: await convertCsvToJsonbText("./db/question_results/q4_ans.csv"),
            sample_answer: `SELECT c.name, e.continent,
            ROW_NUMBER() OVER (PARTITION BY e.continent ORDER BY (c.population * e.percentage) DESC) AS rank_continent,
            ROW_NUMBER() OVER (ORDER BY c.population DESC) AS rank_world
            FROM country c
            INNER JOIN encompasses e ON c.code = e.country
            WINDOW
            w_continent AS (PARTITION BY e.continent ORDER BY (c.population * e.percentage) DESC),
            w_world AS (ORDER BY c.population DESC)
            ORDER BY rank_world;`,
            max_timeout: 1000,
        },
        {
            id: 5,
            question_name: "Items with Stock in Warehouses",
            schema_name: "tpcc",
            description: `The TPC-C dataset is a database schema designed to simulate a wholesale supplier's operations. It includes information about warehouses, items, and stocks of items at each warehouse. Retrieve items for which there exists at least one warehouse that has that item in stock.`,
            question_schema: tpccSchema,
            question_data: tpccData,
            answer_data: await convertCsvToJsonbText("./db/question_results/q5_ans.csv"),
            sample_answer: `SELECT i.i_id
            FROM items i
            WHERE NOT EXISTS (
                SELECT *
                FROM warehouses w
                WHERE NOT EXISTS (
                    SELECT *
                    FROM stocks s
                    WHERE s.w_id = w.w_id AND s.i_id = i.i_id
                )
            );
            `,
            max_timeout: 1000,
        },
        {
            id: 6,
            question_name: "Top 3 Most Popular Car Models by State",
            schema_name: "carprices",
            description: `The Car Sales dataset provides comprehensive information about car sales, including details about the cars themselves (such as make, model, year, and condition) and information about the sales transactions (such as selling price and seller). Retrieve the top 3 most popular car models (based on total sales) for each state`,
            question_schema: carpricesSchema,
            question_data: carpricesData,
            answer_data: await convertCsvToJsonbText("./db/question_results/q6_ans.csv"),
            sample_answer: `WITH ranked_models AS (
                SELECT
                    c.state,
                    c.model,
                    SUM(s.sellingprice) AS total_sales,
                    ROW_NUMBER() OVER (PARTITION BY c.state ORDER BY SUM(s.sellingprice) DESC) AS rank
                FROM
                    Cars c
                INNER JOIN
                    Sales s ON c.vin = s.vin
                GROUP BY
                    c.state, c.model
            )
            SELECT
                state, model, total_sales
            FROM
                ranked_models
            WHERE
                rank <= 3;
            `,
            max_timeout: 1000,
        },
        {
            id: 7,
            question_name: "Vehicle Numbers Sold by Top Seller",
            schema_name: "carprices",
            description: `The Car Sales dataset provides comprehensive information about car sales, including details about the cars themselves (such as make, model, year, and condition) and information about the sales transactions (such as selling price and seller). Select all vehicle numbers (vin) sold by the seller which made the most sales`,
            question_schema: carpricesSchema,
            question_data: carpricesData,
            answer_data: await convertCsvToJsonbText("./db/question_results/q7_ans.csv"),
            sample_answer: `WITH seller_max_sales AS (
                SELECT
                    seller,
                    RANK() OVER (ORDER BY SUM(sellingprice) DESC) AS sales_rank
                FROM
                    Sales
                GROUP BY
                    seller
            )
            SELECT
                s.vin
            FROM
                Sales s
            INNER JOIN
                seller_max_sales sms ON s.seller = sms.seller
            WHERE
                sms.sales_rank = 1;
            `,
            max_timeout: 1000,
        },
        {
            id: 8,
            question_name: "Items Available in Stock in Singapore",
            schema_name: "tpcc",
            description: `The TPC-C dataset is a database schema designed to simulate a wholesale supplier's operations. It includes information about warehouses, items, and stocks of items at each warehouse. Find the id of items that are available in stock in warehouses located in Singapore.`,
            question_schema: tpccSchema,
            question_data: tpccData,
            answer_data: await convertCsvToJsonbText("./db/question_results/q8_ans.csv"),
            sample_answer: `SELECT DISTINCT s.i_id
            FROM stocks s
            JOIN warehouses w ON s.w_id = w.w_id
            WHERE w.w_city = 'Singapore'
            ORDER BY s.i_id;
            `,
            max_timeout: 1000,
        },
        {
            id: 9,
            question_name: "High-Population Cities",
            schema_name: "mondial",
            description: `The MONDIAL Database is a database of geographic and demographic data created in 1998 at Freiburg University and maintained at G¨ottingen University since 2002. Retrieve the names of countries where there are cities with a population greater than 1,000,000.`,
            question_schema: mondialSchema,
            question_data: mondialData,
            answer_data: await convertCsvToJsonbText("./db/question_results/q9_ans.csv"),
            sample_answer: `SELECT DISTINCT c.name
            FROM city ci
            JOIN country c ON ci.country = c.code
            WHERE ci.population > 1000000;
            `,
            max_timeout: 1000,
        },
        {
            id: 10,
            question_name: "Total Time Taken by Each Team",
            schema_name: "letour",
            description: `The Tour de France is an annual professional road cycling competition held primarily in France, with occasional routes passing through neighbouring countries. Retrieve the total time taken by each team and arrange them in ascending order.`,
            question_schema: leTourSchema,
            question_data: leTourData,
            answer_data: await convertCsvToJsonbText("./db/question_results/q10_ans.csv"),
            sample_answer: `SELECT r.team, SUM(ri.time - ri.bonus + ri.penalty) AS team_total_time
            FROM results_individual ri
            JOIN riders r ON ri.rider = r.bib
            GROUP BY r.team
            ORDER BY team_total_time;
            `,
            max_timeout: 1000,
        },
    ];
    return questions;
}

export default loadQuestions;
