// app/actions.ts
"use server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface JobItem extends RowDataPacket {
  queue_id: number;
  iorder: number;
  takenby: string | object;
}

export async function fetchJobs(date: string): Promise<JobItem[]> {
  try {
    const [rows] = await pool.query<JobItem[]>(
      `SELECT iorder, takenby, queue_id FROM slots WHERE DATE(date) = ?`,
      [date]
    );
    return rows as JobItem[];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch jobs");
  }
}