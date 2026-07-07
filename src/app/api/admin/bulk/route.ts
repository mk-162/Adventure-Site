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
import {
  adminBulkSchema,
  validateJsonBody,
  validateCmsBody,
  BULK_STATUS_VALUES_BY_TYPE,
} from "@/lib/api/validate";
import { requireAdminRole, AdminAuthError } from "@/lib/admin-auth";

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
  // Bulk mutations are destructive at scale — require admin+ (super/admin),
  // not merely "any authenticated admin" (proxy.ts only checks that the
  // admin_token JWT is valid, not the role it carries).
  let admin;
  try {
    admin = await requireAdminRole(["super", "admin"]);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    throw error;
  }

  const v = await validateJsonBody(req, adminBulkSchema);
  if (!v.ok) return v.response;
  const { contentType, operation, ids, data } = v.data;

  try {
    const table = tableMap[contentType];
    const statusValues = BULK_STATUS_VALUES_BY_TYPE[contentType];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updateData: Record<string, any> = {};
    let isDelete = false;

    // Operation logic
    switch (operation) {
      case "status_change": {
        if (!data?.status || typeof data.status !== "string") {
          return NextResponse.json(
            { error: "Status is required for status_change" },
            { status: 400 }
          );
        }
        if (!statusValues) {
          return NextResponse.json(
            { error: `${contentType} has no status column — status_change is not supported` },
            { status: 400 }
          );
        }
        if (!statusValues.includes(data.status)) {
          return NextResponse.json(
            {
              error: `Invalid status "${data.status}" for ${contentType}. Allowed: ${statusValues.join(", ")}`,
            },
            { status: 400 }
          );
        }
        // Publishing via bulk is allowed, but only because it's explicit —
        // the caller must pass status: "published" deliberately; there's no
        // separate "publish" shorthand that skips this check.
        updateData = { status: data.status };
        break;
      }

      case "field_update": {
        if (!data || Object.keys(data).length === 0) {
          return NextResponse.json(
            { error: "Data is required for field_update" },
            { status: 400 }
          );
        }
        // Validate against the per-content-type allow-list so arbitrary
        // columns (e.g. billingTier, claimStatus) can't be mass-mutated.
        const validated = validateCmsBody(contentType, data);
        if (!validated.success) {
          return NextResponse.json(
            { error: `Invalid field_update for ${contentType}: ${validated.issues.join("; ")}` },
            { status: 400 }
          );
        }
        updateData = validated.data;
        break;
      }

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
        if (statusValues) {
          // Soft-archive: content types with a status column are never hard
          // deleted via bulk actions — set status='archived' instead.
          updateData = { status: "archived" };
        } else {
          // No status column (e.g. transport) — nothing to archive, so this
          // is the only content type that's actually hard-deleted here.
          isDelete = true;
        }
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
    const loggedOperation = operation === "delete" && !isDelete ? "soft_delete" : operation;

    // Log to bulk_operations — adminUserId comes from the verified admin_token
    // JWT (requireAdminRole above), never from client-supplied headers.
    await db.insert(bulkOperations).values({
      operationType: loggedOperation,
      contentType: contentType,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      affectedIds: result.map((r: any) => r.id.toString()),
      changes: isDelete ? null : updateData,
      adminUserId: admin.id,
    });

    console.log(
      `[admin/bulk] ${admin.email} (${admin.role}) ran ${loggedOperation} on ${contentType} — ${affectedCount} affected`
    );

    return NextResponse.json({
      success: true,
      data: {
        operation: loggedOperation,
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
