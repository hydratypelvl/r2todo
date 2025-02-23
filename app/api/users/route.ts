import { NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date") || "2024-07-13" // Default date if none provided

    const [rows] = await pool.query(`SELECT iorder, takenby, queue_id FROM slots WHERE DATE(date) = ?`, [date])

    return NextResponse.json(rows)
  } catch (error) {
    return NextResponse.json({ message: "Error fetching data", error }, { status: 500 })
  }
}