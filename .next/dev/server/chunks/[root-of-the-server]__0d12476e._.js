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
/**
 * Database client singleton.
 * Prevents creating multiple Prisma clients during development hot-reloads.
 */ const globalForPrisma = globalThis;
const db = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    // Log queries in development for debugging
    log: ("TURBOPACK compile-time truthy", 1) ? [
        "query",
        "error",
        "warn"
    ] : "TURBOPACK unreachable"
});
// Store in global to reuse across hot-reloads (development only)
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = db;
}),
"[project]/FWMS/app/api/marketplace/waste/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/lib/db.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        // Get user ID from header
        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        // Find user in database
        let user = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
            where: {
                id: userId
            },
            include: {
                business: true
            }
        });
        // If user doesn't exist and it's a demo charity user, create a temporary one
        if (!user && (userId.includes("charity") || userId === "u-charity-1")) {
            console.log(`[Marketplace] Demo charity user ${userId} not found, allowing access for public portal`);
            // For demo purposes, allow access without creating a user
            // The filtering will work based on userId pattern
            user = {
                id: userId,
                role: "PARTNER",
                business: null
            };
        } else if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User not found"
            }, {
                status: 404
            });
        }
        // Determine availableFor based on user's business type
        let availableFor = null;
        if (user.business?.type === "NGO") {
            availableFor = "CHARITY";
        } else if (user.business?.type === "FARM") {
            availableFor = "FARMER";
        } else {
            // Fallback: Check if user ID matches charity/farmer pattern (for demo/testing)
            // Or check user role - PARTNER users might be charity or farmer
            if (userId.includes("charity") || userId.includes("ngo")) {
                // Demo fallback: if userId contains "charity" or "ngo", treat as charity
                console.log(`[Marketplace] User ${userId} matches charity pattern, defaulting to CHARITY`);
                availableFor = "CHARITY";
            } else if (userId.includes("farmer") || userId.includes("farm")) {
                // Demo fallback: if userId contains "farmer" or "farm", treat as farmer
                console.log(`[Marketplace] User ${userId} matches farmer pattern, defaulting to FARMER`);
                availableFor = "FARMER";
            } else if (user.role === "PARTNER" && !user.business) {
                // If user is PARTNER but no business, check userId pattern
                if (userId.includes("charity") || userId.includes("ngo")) {
                    availableFor = "CHARITY";
                } else {
                    availableFor = "FARMER";
                }
                console.log(`[Marketplace] User ${userId} is PARTNER without business, defaulting to ${availableFor}`);
            } else {
                console.log(`[Marketplace] User ${userId} has business type: ${user.business?.type || "null"}, role: ${user.role}, cannot access marketplace`);
                return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Only charity and farmer users can access marketplace",
                    details: `Your business type is: ${user.business?.type || "not set"}. Please register as a FARM or NGO business.`
                }, {
                    status: 403
                });
            }
        }
        console.log(`[Marketplace] User ${userId} (business type: ${user.business?.type || "none"}, role: ${user.role}) looking for items with availableFor: ${availableFor}`);
        // Get all waste entries that are PENDING and match the user's role
        // Exclude items that already have active pickup requests
        const activeRequestWasteIds = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].pickupRequest.findMany({
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
        const requestedWasteIds = new Set(activeRequestWasteIds.map((r)=>r.wasteEntryId).filter((id)=>id !== null));
        console.log(`[Marketplace] Found ${requestedWasteIds.size} waste items with active pickup requests (excluded from results)`);
        // Debug: Check all waste entries to see what's available
        const allWasteEntries = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.findMany({
            select: {
                id: true,
                status: true,
                availableFor: true,
                wasteType: true,
                subType: true,
                quantity: true
            },
            take: 20,
            orderBy: {
                createdAt: "desc"
            }
        });
        console.log(`[Marketplace] Recent waste entries in DB (${allWasteEntries.length}):`, allWasteEntries.map((e)=>({
                id: e.id,
                status: e.status,
                availableFor: e.availableFor,
                wasteType: e.wasteType,
                subType: e.subType,
                quantity: e.quantity
            })));
        // Build where clause with wasteType-based filtering
        // Rule: EDIBLE → CHARITY only, all other types → FARMER only
        // Only show items that are PENDING and not DROPPED
        // Prepare expiry date filter
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        // Build base where clause
        // All conditions are ANDed together by default in Prisma
        const whereClause = {
            status: "PENDING",
            id: {
                notIn: Array.from(requestedWasteIds)
            },
            // Explicitly exclude dropped items
            actionType: {
                not: "DROPPED"
            },
            // Expiry date filter - show items that haven't expired yet
            // If expiryDate is null, show it (no expiry means it's still good)
            // If expiryDate exists, only show if it's today or in the future
            AND: [
                {
                    OR: [
                        {
                            expiryDate: null
                        },
                        {
                            expiryDate: {
                                gte: today
                            }
                        }
                    ]
                }
            ]
        };
        // Add wasteType and availableFor filters based on user type
        // This is the primary filter - wasteType determines who can see it
        if (availableFor === "CHARITY") {
            // Charity users only see EDIBLE items
            whereClause.wasteType = "EDIBLE";
            // Filter by availableFor - allow both explicit CHARITY and null (for legacy/inferred records)
            // Since wasteType=EDIBLE implies CHARITY, we accept null availableFor
            whereClause.AND.push({
                OR: [
                    {
                        availableFor: "CHARITY"
                    },
                    {
                        availableFor: null
                    }
                ]
            });
        } else if (availableFor === "FARMER") {
            // Farmer users see all types EXCEPT EDIBLE
            whereClause.wasteType = {
                not: "EDIBLE"
            };
            // Filter by availableFor - allow both explicit FARMER and null (for legacy/inferred records)
            whereClause.AND.push({
                OR: [
                    {
                        availableFor: "FARMER"
                    },
                    {
                        availableFor: null
                    }
                ]
            });
        }
        console.log(`[Marketplace] Querying with where clause:`, JSON.stringify(whereClause, null, 2));
        console.log(`[Marketplace] Looking for items with wasteType=${availableFor === "CHARITY" ? "EDIBLE" : "NOT EDIBLE"} AND (availableFor=${availableFor} OR availableFor=null)`);
        // First, let's do a simple test query to verify database connection
        const testQuery = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.findFirst({
            where: {
                wasteType: "EDIBLE",
                status: "PENDING"
            },
            select: {
                id: true,
                subType: true,
                status: true,
                availableFor: true,
                wasteType: true,
                actionType: true,
                expiryDate: true
            }
        });
        console.log(`[Marketplace] Test query - Found one EDIBLE PENDING entry:`, testQuery);
        const wasteEntries = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.findMany({
            where: whereClause,
            include: {
                business: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                        contactPerson: true,
                        type: true
                    }
                },
                loggedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        console.log(`[Marketplace] Found ${wasteEntries.length} waste entries matching filter criteria`);
        // Log details of found entries for debugging
        if (wasteEntries.length > 0) {
            console.log(`[Marketplace] Sample entries found:`, wasteEntries.slice(0, 3).map((e)=>({
                    id: e.id,
                    subType: e.subType,
                    wasteType: e.wasteType,
                    status: e.status,
                    availableFor: e.availableFor,
                    actionType: e.actionType,
                    quantity: e.quantity,
                    expiryDate: e.expiryDate
                })));
        } else {
            console.log(`[Marketplace] No entries found. Checking if any matching entries exist...`);
            // Debug query - check if any entries exist with the expected criteria
            const debugQuery = {
                wasteType: availableFor === "CHARITY" ? "EDIBLE" : {
                    not: "EDIBLE"
                },
                availableFor: availableFor,
                status: "PENDING"
            };
            console.log(`[Marketplace] Debug query:`, JSON.stringify(debugQuery, null, 2));
            const debugEntries = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.findMany({
                where: debugQuery,
                select: {
                    id: true,
                    subType: true,
                    status: true,
                    availableFor: true,
                    wasteType: true,
                    expiryDate: true,
                    actionType: true
                },
                take: 10,
                orderBy: {
                    createdAt: "desc"
                }
            });
            console.log(`[Marketplace] Debug entries matching criteria:`, debugEntries);
            // Also check all EDIBLE entries regardless of availableFor
            if (availableFor === "CHARITY") {
                const allEdible = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.findMany({
                    where: {
                        wasteType: "EDIBLE",
                        status: "PENDING"
                    },
                    select: {
                        id: true,
                        subType: true,
                        status: true,
                        availableFor: true,
                        expiryDate: true,
                        actionType: true
                    },
                    take: 10,
                    orderBy: {
                        createdAt: "desc"
                    }
                });
                console.log(`[Marketplace] All PENDING EDIBLE entries in DB (regardless of availableFor):`, allEdible);
            }
        }
        // Transform to match expected format
        const mappedItems = wasteEntries.map((entry)=>({
                id: entry.id,
                cafeId: entry.businessId,
                cafeName: entry.business.name || "Unknown Café",
                itemName: entry.subType || entry.wasteType,
                type: entry.wasteType.toLowerCase(),
                quantity: entry.quantity,
                expiryDate: entry.expiryDate?.toISOString().split("T")[0] || "",
                status: entry.status.toLowerCase(),
                description: entry.notes || undefined,
                createdAt: entry.createdAt.toISOString(),
                // Compute effective availableFor from wasteType to correct legacy data
                availableFor: entry.wasteType === "EDIBLE" ? "CHARITY" : "FARMER",
                business: {
                    id: entry.businessId,
                    name: entry.business.name || "Unknown Café",
                    type: entry.business.type,
                    address: entry.business.address
                },
                cafeContact: {
                    name: entry.business.contactPerson || entry.loggedBy.name || "Café Admin",
                    email: entry.business.email || entry.loggedBy.email || null,
                    organizationName: entry.business.name || "Unknown Café",
                    phone: entry.business.phone || null,
                    address: entry.business.address || null
                }
            }));
        console.log(`[Marketplace] Returning ${mappedItems.length} items for ${availableFor}`);
        console.log(`[Marketplace] Mapped items details:`, mappedItems.map((item)=>({
                id: item.id,
                itemName: item.itemName,
                wasteType: item.type,
                availableFor: item.availableFor,
                status: item.status,
                expiryDate: item.expiryDate
            })));
        // Filter out any mismatched legacy records just in case
        const filteredItems = mappedItems.filter((item)=>{
            if (availableFor === "CHARITY") {
                return item.availableFor === "CHARITY";
            }
            if (availableFor === "FARMER") {
                return item.availableFor === "FARMER";
            }
            return false;
        });
        console.log(`[Marketplace] Final filtered items count: ${filteredItems.length} (after filtering by availableFor)`);
        if (filteredItems.length !== mappedItems.length) {
            console.log(`[Marketplace] Filtered out ${mappedItems.length - filteredItems.length} items due to availableFor mismatch`);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(filteredItems);
    } catch (error) {
        console.error("[Marketplace Waste] Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch marketplace waste"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0d12476e._.js.map