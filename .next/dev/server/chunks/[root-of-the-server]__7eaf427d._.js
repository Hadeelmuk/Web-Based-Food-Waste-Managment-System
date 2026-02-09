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
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/FWMS/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const db = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: ("TURBOPACK compile-time truthy", 1) ? [
        "query",
        "error",
        "warn"
    ] : "TURBOPACK unreachable"
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = db;
}),
"[project]/FWMS/app/api/farmer/available/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/lib/db.ts [app-route] (ecmascript)");
;
;
async function GET(req) {
    try {
        // Try to use database first, fallback to in-memory if database fails
        try {
            // Get all waste entry IDs that have active pickup requests (pending or approved)
            const activeRequests = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].pickupRequest.findMany({
                where: {
                    status: {
                        in: [
                            "PENDING",
                            "APPROVED"
                        ]
                    }
                },
                select: {
                    wasteEntryId: true
                }
            });
            const requestedWasteIds = new Set(activeRequests.map((r)=>r.wasteEntryId).filter((id)=>id !== null));
            // Fetch waste entries from database
            // Filter for organic/coffee waste that is pending and not requested
            const wasteEntries = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.findMany({
                where: {
                    wasteType: {
                        in: [
                            "ORGANIC",
                            "COFFEE_GROUNDS"
                        ]
                    },
                    status: "PENDING",
                    id: {
                        notIn: Array.from(requestedWasteIds)
                    },
                    // Don't show expired items
                    OR: [
                        {
                            expiryDate: null
                        },
                        {
                            expiryDate: {
                                gte: new Date()
                            }
                        }
                    ]
                },
                include: {
                    business: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    date: "desc"
                }
            });
            // Transform database entries to match expected format
            const items = wasteEntries.map((entry)=>{
                // Map database wasteType to simple type string
                const typeMap = {
                    ORGANIC: "organic",
                    COFFEE_GROUNDS: "coffee",
                    EDIBLE: "edible"
                };
                return {
                    id: entry.id,
                    cafeId: entry.businessId,
                    cafeName: entry.business.name || "Green Café",
                    itemName: entry.subType || typeMap[entry.wasteType] || entry.wasteType.toLowerCase(),
                    type: typeMap[entry.wasteType] || entry.wasteType.toLowerCase(),
                    quantity: entry.quantity,
                    expiryDate: entry.expiryDate ? entry.expiryDate.toISOString().split("T")[0] : "",
                    status: entry.status.toLowerCase()
                };
            });
            console.log(`[Farmer Available] Returning ${items.length} items from database`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(items);
        } catch (dbError) {
            // If database fails, fallback to in-memory arrays
            console.warn("[Farmer Available] Database error, falling back to in-memory:", dbError);
            const { wasteLogs, pickupRequests, users } = await __turbopack_context__.A("[project]/FWMS/app/api/_data.ts [app-route] (ecmascript, async loader)");
            const requestedWasteIds = new Set(pickupRequests.filter((p)=>p.status === "pending" || p.status === "approved").map((p)=>p.wasteId));
            const items = wasteLogs.filter((w)=>(w.type === "organic" || w.type === "coffee") && w.status === "pending" && w.assignedTo === "farmer" && !requestedWasteIds.has(w.id)).map((w)=>{
                const cafeUser = users.find((u)=>u.cafeId === w.cafeId);
                return {
                    id: w.id,
                    cafeId: w.cafeId,
                    cafeName: cafeUser?.organizationName || "Green Café",
                    itemName: w.itemName,
                    type: w.type,
                    quantity: w.quantity,
                    expiryDate: w.expiryDate,
                    status: w.status
                };
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(items);
        }
    } catch (error) {
        console.error("[Farmer Available] Error:", error);
        // Return empty array instead of error to prevent frontend crashes
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([]);
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7eaf427d._.js.map