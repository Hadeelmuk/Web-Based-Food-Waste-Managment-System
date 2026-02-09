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
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

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
"[project]/FWMS/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authOptions",
    ()=>authOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
const authOptions = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            /**
       * Authorizes user by checking email and password against database.
       * Returns user object if valid, null otherwise.
       */ async authorize (credentials) {
                // Validate credentials
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                // Find user in database
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
                    where: {
                        email: credentials.email
                    },
                    include: {
                        business: true
                    }
                });
                if (!user) {
                    return null;
                }
                // Verify password using bcrypt
                const isPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    return null;
                }
                // Return user data for session
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    businessId: user.businessId,
                    business: user.business
                };
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
        signOut: "/"
    },
    callbacks: {
        /**
     * Adds user data to JWT token when user signs in.
     */ async jwt ({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.businessId = user.businessId;
                token.business = user.business;
            }
            return token;
        },
        /**
     * Adds user data from token to session object.
     */ async session ({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.businessId = token.businessId;
                session.user.business = token.business;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET
};
}),
"[project]/FWMS/app/api/admin/pickups/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/lib/db.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(req) {
    try {
        let user = null;
        // Try NextAuth session first
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        if (session?.user) {
            user = {
                id: session.user.id,
                role: session.user.role,
                businessId: session.user.businessId
            };
        } else {
            // Fall back to x-user-id header (backward compatibility)
            const userId = req.headers.get("x-user-id");
            if (userId) {
                try {
                    const dbUser = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
                        where: {
                            id: userId
                        },
                        include: {
                            business: true
                        }
                    });
                    if (dbUser) {
                        user = {
                            id: dbUser.id,
                            role: dbUser.role,
                            businessId: dbUser.businessId
                        };
                    }
                } catch (error) {
                    console.error(`[Admin Pickups] Database error looking up user ${userId}:`, error);
                }
            }
        }
        if (!user) {
            console.log("[Admin Pickups] No user found - unauthorized");
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        // Allow both ADMIN and STAFF to view pickup requests
        if (user.role !== "ADMIN" && user.role !== "STAFF") {
            console.log(`[Admin Pickups] User ${user.id} is not allowed (role: ${user.role})`);
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Forbidden - Staff or Admin access required"
            }, {
                status: 403
            });
        }
        // Debug: Check all pickup requests in DB first with full details
        const allPickupRequests = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].pickupRequest.findMany({
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        business: {
                            select: {
                                id: true,
                                name: true,
                                type: true
                            }
                        }
                    }
                },
                wasteEntry: {
                    select: {
                        id: true,
                        subType: true,
                        wasteType: true,
                        quantity: true
                    }
                },
                business: {
                    select: {
                        id: true,
                        name: true,
                        type: true
                    }
                }
            },
            take: 20
        });
        console.log(`[Admin Pickups] Total pickup requests in DB: ${allPickupRequests.length}`);
        if (allPickupRequests.length > 0) {
            console.log(`[Admin Pickups] Sample pickup requests with details:`, JSON.stringify(allPickupRequests.slice(0, 3).map((p)=>({
                    id: p.id,
                    status: p.status,
                    requesterId: p.requesterId,
                    requesterName: p.requester?.name,
                    requesterBusiness: p.requester?.business?.name,
                    requesterBusinessType: p.requester?.business?.type,
                    wasteEntryId: p.wasteEntryId,
                    wasteItem: p.wasteEntry?.subType || p.wasteEntry?.wasteType,
                    wasteQuantity: p.wasteEntry?.quantity,
                    businessId: p.businessId,
                    businessName: p.business?.name
                })), null, 2));
        }
        // Get pickup requests for admin's business
        // If admin has no businessId, try to find one from waste entries or show all requests
        let targetBusinessId = user.businessId;
        if (!targetBusinessId) {
            console.log("[Admin Pickups] Admin user has no businessId - trying to find one...");
            try {
                // Try to find businessId from waste entries created by this user
                const wasteEntry = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.findFirst({
                    where: {
                        loggedById: user.id
                    },
                    select: {
                        businessId: true
                    }
                });
                if (wasteEntry?.businessId) {
                    targetBusinessId = wasteEntry.businessId;
                    console.log(`[Admin Pickups] Found businessId from waste entry: ${targetBusinessId}`);
                    // Try to update admin user with this businessId (don't fail if it doesn't work)
                    try {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.update({
                            where: {
                                id: user.id
                            },
                            data: {
                                businessId: targetBusinessId
                            }
                        });
                        user.businessId = targetBusinessId;
                    } catch (updateError) {
                        console.error("[Admin Pickups] Failed to update user businessId:", updateError);
                    // Continue anyway with the found businessId
                    }
                } else {
                    // Try to find any CAFE business
                    try {
                        const cafeBusiness = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.findFirst({
                            where: {
                                type: "CAFE"
                            }
                        });
                        if (cafeBusiness) {
                            targetBusinessId = cafeBusiness.id;
                            console.log(`[Admin Pickups] Found CAFE business: ${targetBusinessId}`);
                            // Try to update admin user with this businessId (don't fail if it doesn't work)
                            try {
                                await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.update({
                                    where: {
                                        id: user.id
                                    },
                                    data: {
                                        businessId: targetBusinessId
                                    }
                                });
                                user.businessId = targetBusinessId;
                            } catch (updateError) {
                                console.error("[Admin Pickups] Failed to update user businessId:", updateError);
                            // Continue anyway with the found businessId
                            }
                        } else {
                            console.log("[Admin Pickups] No businessId found - showing ALL requests");
                        }
                    } catch (businessError) {
                        console.error("[Admin Pickups] Error finding CAFE business:", businessError);
                        console.log("[Admin Pickups] Showing ALL requests due to error");
                    }
                }
            } catch (error) {
                console.error("[Admin Pickups] Error finding businessId:", error);
                console.log("[Admin Pickups] Showing ALL requests due to error");
            // Continue without businessId - will show all requests
            }
        }
        const where = {};
        if (targetBusinessId) {
            where.businessId = targetBusinessId;
            console.log(`[Admin Pickups] Filtering by businessId: ${targetBusinessId}`);
        } else {
            console.log("[Admin Pickups] Showing ALL requests (no businessId to filter by)");
        }
        let pickupRequests;
        try {
            pickupRequests = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].pickupRequest.findMany({
                where,
                include: {
                    requester: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            business: {
                                select: {
                                    id: true,
                                    name: true,
                                    type: true,
                                    address: true,
                                    phone: true,
                                    email: true
                                }
                            }
                        }
                    },
                    wasteEntry: {
                        select: {
                            id: true,
                            subType: true,
                            wasteType: true,
                            quantity: true,
                            status: true
                        }
                    },
                    business: {
                        select: {
                            id: true,
                            name: true,
                            type: true
                        }
                    }
                },
                orderBy: {
                    requestedDate: "desc"
                }
            });
            console.log(`[Admin Pickups] Query returned ${pickupRequests.length} requests with where clause:`, JSON.stringify(where));
        } catch (queryError) {
            console.error("[Admin Pickups] Database query error:", queryError);
            // If query fails, try without where clause (show all)
            try {
                pickupRequests = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].pickupRequest.findMany({
                    include: {
                        requester: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                business: {
                                    select: {
                                        id: true,
                                        name: true,
                                        type: true,
                                        address: true,
                                        phone: true,
                                        email: true
                                    }
                                }
                            }
                        },
                        wasteEntry: {
                            select: {
                                id: true,
                                subType: true,
                                wasteType: true,
                                quantity: true,
                                status: true
                            }
                        },
                        business: {
                            select: {
                                id: true,
                                name: true,
                                type: true
                            }
                        }
                    },
                    orderBy: {
                        requestedDate: "desc"
                    },
                    take: 50
                });
                console.log(`[Admin Pickups] Fallback query returned ${pickupRequests.length} requests`);
            } catch (fallbackError) {
                console.error("[Admin Pickups] Fallback query also failed:", fallbackError);
                return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Database error",
                    message: fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
                    requests: []
                }, {
                    status: 500
                });
            }
        }
        const items = pickupRequests.map((p)=>{
            const waste = p.wasteEntry;
            const requester = p.requester;
            // Determine requester type from requester's business
            let requesterType = "farmer";
            if (requester?.business?.type === "NGO") {
                requesterType = "charity";
            } else if (requester?.business?.type === "FARM") {
                requesterType = "farmer";
            }
            // Get requester name - prefer business name if available, otherwise user name
            const requesterName = requester?.business?.name || requester?.name || "Unknown";
            console.log(`[Admin Pickups] Processing request ${p.id}:`, {
                requesterId: p.requesterId,
                requesterName,
                requesterType,
                requesterBusinessType: requester?.business?.type,
                wasteEntryId: p.wasteEntryId,
                businessId: p.businessId
            });
            return {
                id: p.id,
                wasteId: p.wasteEntryId || "",
                requesterId: p.requesterId,
                requesterName,
                requesterType,
                itemName: waste?.subType || waste?.wasteType || "Unknown",
                itemType: waste?.wasteType?.toLowerCase() || "unknown",
                quantity: waste?.quantity || 0,
                status: p.status.toLowerCase(),
                dateRequested: p.requestedDate.toISOString(),
                notes: p.notes || undefined
            };
        });
        console.log(`[Admin Pickups] Found ${pickupRequests.length} pickup requests in DB, returning ${items.length} items`);
        console.log(`[Admin Pickups] User businessId: ${user.businessId}`);
        console.log(`[Admin Pickups] Target businessId used for filtering: ${targetBusinessId}`);
        if (pickupRequests.length > 0) {
            console.log(`[Admin Pickups] Request businessIds:`, pickupRequests.map((p)=>p.businessId));
            console.log(`[Admin Pickups] Request statuses:`, pickupRequests.map((p)=>p.status));
            console.log(`[Admin Pickups] Request IDs:`, pickupRequests.map((p)=>p.id));
            console.log(`[Admin Pickups] Request requesterIds:`, pickupRequests.map((p)=>p.requesterId));
        } else {
            console.log(`[Admin Pickups] No pickup requests found with where clause:`, JSON.stringify(where));
        }
        // Return the items as an array
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(items, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("[Admin Pickups] Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch pickup requests",
            message: error instanceof Error ? error.message : String(error)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ffcbdab6._.js.map