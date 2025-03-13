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
    lic_plate: string;
  };
}

function formatLicensePlate(input: string): string {
  if (!input || input.trim().length === 0) {
    return "";
  }

  // Clean the input: uppercase, remove special chars except spaces and dashes
  const cleaned = input
    .toUpperCase()
    .replace(/[^A-Z0-9 -]/g, '')
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();

  // Try to match standard format (2 letters + 1-4 numbers)
  const standardMatch = cleaned.match(/^([A-Z]{2})[ -]*(\d{1,4})$/);
  if (standardMatch) {
    return `${standardMatch[1]} - ${standardMatch[2]}`;
  }

  // Try to match custom plate with separator
  const customWithSeparator = cleaned.match(/^([A-Z0-9]+)[ -]+([A-Z0-9]+)$/);
  if (customWithSeparator) {
    return `${customWithSeparator[1]} - ${customWithSeparator[2]}`;
  }

  // For everything else, return the cleaned version
  return cleaned;
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

      // Format the license plate
      const rawPlate = parsedTakenBy.lic_plate?.trim() || "";
      const formattedPlate = formatLicensePlate(rawPlate);

      return {
        queue_id: row.queue_id,
        iorder: row.iorder,
        takenby: {
          car_brand: parsedTakenBy.car_brand?.trim() || "N/A",
          car_model: parsedTakenBy.car_model?.trim() || "N/A",
          service: Number(parsedTakenBy.service) || 0,
          lic_plate: formattedPlate || "N/A" // Will show N/A only if empty after formatting
        }
      };
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch jobs");
  }
}

// Helper function for phone formatting
// function formatPhoneNumber(phone: string): string {
//   if (!phone) return "N/A";
//   const cleaned = phone.replace(/\s+/g, "").replace(/^\+371/, "");
//   return cleaned.length >= 8 ? `****${cleaned.slice(-4)}` : cleaned;
// }