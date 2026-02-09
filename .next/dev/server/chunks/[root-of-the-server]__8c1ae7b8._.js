module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/FWMS/app/api/farmer/requests/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET(req) {
    try {
        // Get user ID from request header
        const userId = req.headers.get("x-user-id");
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([]);
        }
        const { db } = await __turbopack_context__.A("[project]/FWMS/lib/db.ts [app-route] (ecmascript, async loader)");
        // Verify user is a farmer (PARTNER role with FARM business type)
        const user = await db.user.findUnique({
            where: {
                id: userId
            },
            include: {
                business: true
            }
        });
        if (!user || user.role !== "PARTNER" || user.business?.type !== "FARM") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([]);
        }
        // Fetch all pickup requests for this farmer
        // Exclude cancelled requests, but include completed ones for history
        const pickupRequests = await db.pickupRequest.findMany({
            where: {
                requesterId: userId,
                status: {
                    notIn: [
                        "CANCELLED"
                    ]
                }
            },
            include: {
                wasteEntry: {
                    include: {
                        business: true
                    }
                },
                business: true
            },
            orderBy: {
                requestedDate: "desc"
            }
        });
        // Transform database format to frontend format
        const items = pickupRequests.map((request)=>{
            const waste = request.wasteEntry;
            const cafe = request.business;
            return {
                id: request.id,
                wasteId: request.wasteEntryId,
                requesterId: request.requesterId,
                requesterType: "farmer",
                status: request.status.toLowerCase(),
                requestedAt: request.requestedDate.toISOString(),
                approvedAt: request.approvedAt?.toISOString(),
                completedAt: request.completedAt?.toISOString(),
                notes: request.notes,
                // Waste item information
                itemName: waste?.subType || "Unknown",
                quantity: waste?.quantity || 0,
                // Café information (only for approved requests)
                cafeName: cafe?.name || "Unknown Café",
                cafeId: cafe?.id,
                cafe: request.status === "APPROVED" && cafe ? {
                    name: cafe.name,
                    phone: cafe.phone,
                    email: cafe.email,
                    address: cafe.address,
                    contactPerson: cafe.contactPerson
                } : null,
                cafeContact: request.status === "APPROVED" && cafe ? {
                    name: cafe.contactPerson || cafe.name,
                    email: cafe.email,
                    phone: cafe.phone,
                    address: cafe.address
                } : null,
                message: request.status === "APPROVED" ? "Please contact the café to arrange pickup." : undefined
            };
        });
        console.log(`[Farmer Requests] Returning ${items.length} requests`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(items);
    } catch (error) {
        console.error("[Farmer Requests] Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([]);
    }
}
async function POST(req) {
    try {
        const body = await req.json();
        if (!body.wasteId || !body.requesterId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing wasteId or requesterId"
            }, {
                status: 400
            });
        }
        const { db } = await __turbopack_context__.A("[project]/FWMS/lib/db.ts [app-route] (ecmascript, async loader)");
        // Verify requester is a valid farmer user
        const requester = await db.user.findUnique({
            where: {
                id: body.requesterId
            },
            include: {
                business: true
            }
        });
        if (!requester) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid requesterId"
            }, {
                status: 400
            });
        }
        if (requester.role !== "PARTNER" || requester.business?.type !== "FARM") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Requester must be a farmer user"
            }, {
                status: 403
            });
        }
        // Find the waste entry
        const wasteEntry = await db.wasteEntry.findUnique({
            where: {
                id: body.wasteId
            },
            include: {
                business: true
            }
        });
        if (!wasteEntry) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Waste item not found"
            }, {
                status: 404
            });
        }
        // Check if waste is available for farmer pickup
        if (wasteEntry.status !== "PENDING" || wasteEntry.availableFor !== "FARMER") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Waste item is not available for farm pickup"
            }, {
                status: 400
            });
        }
        // Prevent duplicate requests for the same waste item
        const existingRequest = await db.pickupRequest.findUnique({
            where: {
                wasteEntryId: body.wasteId
            }
        });
        if (existingRequest) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "This waste item already has a pickup request"
            }, {
                status: 400
            });
        }
        // Create the pickup request
        const pickupRequest = await db.pickupRequest.create({
            data: {
                requesterId: requester.id,
                wasteEntryId: body.wasteId,
                businessId: wasteEntry.businessId,
                notes: body.notes || null,
                status: "PENDING"
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                business: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                        address: true
                    }
                },
                wasteEntry: {
                    select: {
                        id: true,
                        subType: true,
                        quantity: true,
                        status: true
                    }
                }
            }
        });
        console.log(`[Farmer Request] ✅ Created pickup request:`, {
            id: pickupRequest.id,
            wasteEntryId: body.wasteId,
            requesterId: requester.id,
            businessId: wasteEntry.businessId
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(pickupRequest, {
            status: 201
        });
    } catch (error) {
        console.error("[Farmer Request] Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create pickup request",
            message: error instanceof Error ? error.message : String(error)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8c1ae7b8._.js.map