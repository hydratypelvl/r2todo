"use server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface SanitizedJob {
  queue_id: number;
  iorder: number;
  takenby: {
    car_brand: string;
    car_model: string;
    service: number;
    phone: string;
  };
}

export async function fetchJobs(date: string): Promise<SanitizedJob[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT iorder, takenby, queue_id FROM slots WHERE DATE(date) = ?`,
      [date]
    );

    return rows.map(row => {
      // Handle missing takenby data
      const rawTakenBy = row.takenby || {};
      const parsedTakenBy = typeof rawTakenBy === 'string' ? 
        JSON.parse(rawTakenBy) : 
        rawTakenBy;

      return {
        queue_id: row.queue_id,
        iorder: row.iorder,
        takenby: {
          car_brand: parsedTakenBy.car_brand?.trim() || "Unknown Brand",
          car_model: parsedTakenBy.car_model?.trim() || "Unknown Model",
          service: Number(parsedTakenBy.service) || 0,
          phone: formatPhoneNumber(parsedTakenBy.phone_number?.toString() || "")
        }
      };
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch jobs");
  }
}

// Helper function for phone formatting
function formatPhoneNumber(phone: string): string {
  if (!phone) return "N/A";
  const cleaned = phone.replace(/\s+/g, "").replace(/^\+371/, "");
  return cleaned.length >= 8 ? `****${cleaned.slice(-4)}` : cleaned;
}