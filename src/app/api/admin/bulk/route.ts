import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  activities,
  accommodation,
  operators,
  regions,
  locations,
  events,
  transport,
  itineraries,
  answers,
  bulkOperations,
} from "@/db/schema";
import { inArray } from "drizzle-orm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tableMap: Record<string, any> = {
  activities,
  accommodation,
  operators,
  regions,
  locations,
  events,
  transport,
  itineraries,
  answers,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contentType, operation, ids, data } = body;

    // Validation
    if (!contentType || !tableMap[contentType]) {
      return NextResponse.json(
        { error: `Invalid content type: ${contentType}` },
        { status: 400 }
      );
    }
    if (!operation) {
      return NextResponse.json(
        { error: "Operation is required" },
        { status: 400 }
      );
    }
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "ids must be a non-empty array" },
        { status: 400 }
      );
    }

    const table = tableMap[contentType];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updateData: Record<string, any> = {};
    let isDelete = false;

    // Operation logic
    switch (operation) {
      case "status_change":
        if (!data?.status) {
          return NextResponse.json(
            { error: "Status is required for status_change" },
            { status: 400 }
          );
        }
        updateData = { status: data.status };
        break;

      case "field_update":
        if (!data || Object.keys(data).length === 0) {
          return NextResponse.json(
            { error: "Data is required for field_update" },
            { status: 400 }
          );
        }
        updateData = { ...data };
        break;

      case "assign_operator":
        if (!data?.operatorId) {
           return NextResponse.json(
            { error: "operatorId is required for assign_operator" },
            { status: 400 }
          );
        }
        updateData = { operatorId: data.operatorId };
        break;

      case "assign_region":
        if (!data?.regionId) {
          return NextResponse.json(
            { error: "regionId is required for assign_region" },
            { status: 400 }
          );
        }
        updateData = { regionId: data.regionId };
        break;

      case "delete":
        isDelete = true;
        break;

      default:
        return NextResponse.json(
          { error: `Invalid operation: ${operation}` },
          { status: 400 }
        );
    }

    // Execute operation
    let result;
    if (isDelete) {
      result = await db.delete(table).where(inArray(table.id, ids)).returning({ id: table.id });
    } else {
      // Check if trying to update non-existent column
      // This is hard to do dynamically with Drizzle types without casting
      // We'll rely on try-catch for SQL errors if column doesn't exist
      result = await db.update(table).set(updateData).where(inArray(table.id, ids)).returning({ id: table.id });
    }

    const affectedCount = result.length;
    const failedCount = ids.length - affectedCount;

    // Log to bulk_operations
    await db.insert(bulkOperations).values({
      operationType: operation,
      contentType: contentType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      affectedIds: result.map((r: any) => r.id.toString()),
      changes: isDelete ? null : updateData,
      // siteId and adminUserId would come from session/context
    });

    return NextResponse.json({
      success: true,
      data: {
        operation,
        contentType,
        successCount: affectedCount,
        failedCount: Math.max(0, failedCount), // In case affected > ids (unlikely with IDs)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updatedIds: result.map((r: any) => r.id),
      },
    });

  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error("Bulk operation error:", error);
    // Handle specific DB errors like "column does not exist"
    if (error.code === '42703') { // Postgres undefined_column
        return NextResponse.json(
            { error: "Invalid field for this content type" },
            { status: 400 }
        );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
