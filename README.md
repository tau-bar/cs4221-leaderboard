# L33tderboard

## Abstract

This project aims to create an online platform for SQL performance competitions using PostgreSQL, allowing users to submit queries and compete based on correctness and efficiency.

## Introduction

This repository presents an implementation of an online platform for SQL performance competitions using PostgreSQL. The main stakeholders involved are **instructors** and **users**. **Instructors** create competitions by submitting a dataset together with sample queries which represent the model answers. **Users** can participate in competitions by submitting queries which produce the same results as the sample queries. The online platform then judges the user-submitted queries for their correctness and efficiency.

As developers, it is important to understand and gain experience in writing queries that encourage the query optimiser to come up with efficient execution plans, while avoiding slow execution plans. Such a platform for performance benchmarking competitions could provide opportunities for students and junior developers to pick up relevant skills and experience in writing efficient database queries.

## Project Setup

This repository is divided into two subfolders: `backend` and `frontend`.

To set up and run the project locally:

```sh
cd backend
npm install
npm run start:dev
```

```sh
cd frontend
yarn install
yarn start
```

## Contributors

- Liu Chen En
- Lye Wen Jun
- Marcus Tang Xin Kye
- Taufiq Bin Abdul Rahman
- Tay Yan Han
