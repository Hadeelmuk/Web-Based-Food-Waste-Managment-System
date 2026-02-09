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
"[project]/FWMS/app/api/waste/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/node_modules/next-auth/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/FWMS/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
;
;
;
;
const wasteEntrySchema = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    date: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    wasteType: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "EDIBLE",
        "COFFEE_GROUNDS",
        "ORGANIC",
        "EXPIRED",
        "RECYCLABLE",
        "PLATE_WASTE"
    ]),
    subType: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    quantity: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive(),
    actionType: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "DONATE",
        "COMPOST",
        "FARM",
        "REUSE",
        "DROPPED"
    ]),
    destination: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    expiryDate: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
// Helper to get user from session or x-user-id header
async function getUserFromRequest(request) {
    // Try NextAuth session first
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
    if (session?.user) {
        return {
            id: session.user.id,
            role: session.user.role,
            businessId: session.user.businessId
        };
    }
    // Fall back to x-user-id header (backward compatibility)
    const userId = request.headers.get("x-user-id");
    if (userId) {
        try {
            let dbUser = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
                where: {
                    id: userId
                },
                include: {
                    business: true
                }
            });
            // If user doesn't exist, create a default user and business (for backward compatibility with mock users)
            if (!dbUser) {
                console.log(`[getUserFromRequest] User ${userId} not found, creating default user...`);
                // Try to find existing business for this user (by email pattern)
                // This ensures consistency - if user was created before, use same business
                let business = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.findFirst({
                    where: {
                        email: `cafe-${userId}@example.com`
                    }
                });
                // If no business found, create a new one with unique email based on userId
                if (!business) {
                    business = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.create({
                        data: {
                            name: "Green Café",
                            type: "CAFE",
                            email: `cafe-${userId}@example.com`
                        }
                    });
                    console.log(`[getUserFromRequest] Created new business: ${business.id} for user ${userId}`);
                } else {
                    console.log(`[getUserFromRequest] Found existing business: ${business.id} for user ${userId}`);
                }
                // Create user with STAFF role (default for mock users)
                dbUser = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.create({
                    data: {
                        id: userId,
                        email: `user-${userId}@example.com`,
                        password: "$2a$10$dummy",
                        role: "STAFF",
                        businessId: business.id,
                        name: "Staff User"
                    },
                    include: {
                        business: true
                    }
                });
                console.log(`[getUserFromRequest] Created default user: ${dbUser.id} with businessId: ${business.id}`);
            }
            if (dbUser) {
                return {
                    id: dbUser.id,
                    role: dbUser.role,
                    businessId: dbUser.businessId
                };
            }
        } catch (error) {
            console.error(`[getUserFromRequest] Database error looking up user ${userId}:`, error);
        }
    } else {
        console.log("[getUserFromRequest] No x-user-id header provided");
    }
    return null;
}
async function GET(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        // If user has no businessId, find or create a default business
        // Use same email pattern as getUserFromRequest for consistency
        if (!user.businessId) {
            // Try to find existing business for this user (by email pattern)
            let business = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.findFirst({
                where: {
                    email: `cafe-${user.id}@example.com`
                }
            });
            // If no business found, create a new one with unique email based on userId
            if (!business) {
                business = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.create({
                    data: {
                        name: "Green Café",
                        type: "CAFE",
                        email: `cafe-${user.id}@example.com`
                    }
                });
                console.log(`[GET /api/waste] Created new business: ${business.id} for user ${user.id}`);
            } else {
                console.log(`[GET /api/waste] Found existing business: ${business.id} for user ${user.id}`);
            }
            // Update user with businessId
            await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.update({
                where: {
                    id: user.id
                },
                data: {
                    businessId: business.id
                }
            });
            user.businessId = business.id;
        }
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");
        const wasteType = searchParams.get("wasteType");
        const actionType = searchParams.get("actionType");
        const status = searchParams.get("status");
        const recent = searchParams.get("recent") === "true" // Special flag for recent entries
        ;
        const page = parseInt(searchParams.get("page") || "1");
        const limit = recent ? 50 : parseInt(searchParams.get("limit") || "50") // Show all recent entries, not just 5
        ;
        const skip = (page - 1) * limit;
        const where = {};
        // Filter by business if user is not admin
        if (user.role !== "ADMIN") {
            where.businessId = user.businessId;
        } else {
            const businessId = searchParams.get("businessId");
            if (businessId) {
                where.businessId = businessId;
            }
        }
        if (startDate || endDate) {
            where.date = {};
            if (startDate) {
                where.date.gte = new Date(startDate);
            }
            if (endDate) {
                where.date.lte = new Date(endDate);
            }
        }
        if (wasteType && wasteType !== "all") {
            where.wasteType = wasteType;
        }
        if (actionType && actionType !== "all") {
            where.actionType = actionType;
        }
        if (status && status !== "all") {
            where.status = status;
        }
        console.log(`[GET /api/waste] Querying with where clause:`, JSON.stringify(where, null, 2));
        let entries, total;
        try {
            [entries, total] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.findMany({
                    where,
                    include: {
                        loggedBy: {
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
                                type: true
                            }
                        }
                    },
                    orderBy: recent ? {
                        createdAt: "desc"
                    } : {
                        date: "desc"
                    },
                    skip,
                    take: limit
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.count({
                    where
                })
            ]);
            console.log(`[GET /api/waste] Found ${entries.length} entries (total: ${total})`);
        } catch (dbError) {
            console.error("[GET /api/waste] Database error:", dbError);
            const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Database error",
                message: errorMessage,
                details: ("TURBOPACK compile-time truthy", 1) ? String(dbError) : "TURBOPACK unreachable"
            }, {
                status: 500
            });
        }
        // Transform to match /api/staff/waste format for compatibility
        const typeMap = {
            "EDIBLE": "edible",
            "COFFEE_GROUNDS": "coffee",
            "ORGANIC": "organic",
            "EXPIRED": "expired",
            "RECYCLABLE": "recyclable",
            "PLATE_WASTE": "plate_waste"
        };
        const transformedEntries = entries.map((entry)=>{
            const wasteType = String(entry.wasteType);
            const displayType = typeMap[wasteType] || wasteType.toLowerCase();
            const status = String(entry.status).toLowerCase();
            const assignedTo = entry.availableFor ? String(entry.availableFor).toLowerCase() : null;
            return {
                id: entry.id,
                cafeId: entry.businessId,
                type: displayType,
                itemName: entry.subType || displayType || "Unknown",
                quantity: entry.quantity,
                expiryDate: entry.expiryDate ? entry.expiryDate.toISOString().split("T")[0] : "",
                status: status,
                assignedTo: assignedTo,
                actionType: entry.actionType,
                wasteType: entry.wasteType,
                subType: entry.subType,
                destination: entry.destination,
                date: entry.date,
                loggedByName: entry.loggedBy?.name || "Staff",
                createdAt: entry.createdAt.toISOString(),
                updatedAt: entry.updatedAt.toISOString(),
                notes: entry.notes || undefined
            };
        });
        // For recent entries, return simplified format matching /api/staff/waste
        if (recent) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                entries: transformedEntries,
                total: transformedEntries.length
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            entries: transformedEntries,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("[GET /api/waste] Error fetching waste entries:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch waste entries",
            message: errorMessage,
            entries: [],
            total: 0
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const user = await getUserFromRequest(request);
        if (!user) {
            console.error("[POST /api/waste] Unauthorized - no user found");
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized - please log in again"
            }, {
                status: 401
            });
        }
        console.log("[POST /api/waste] User authenticated:", {
            id: user.id,
            role: user.role,
            businessId: user.businessId
        });
        // Only STAFF (café) users can create waste entries
        if (user.role !== "STAFF" && user.role !== "ADMIN") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Only staff members can log waste"
            }, {
                status: 403
            });
        }
        // If user has no businessId, find or create a default business
        // Use same email pattern as getUserFromRequest for consistency
        if (!user.businessId) {
            // Try to find existing business for this user (by email pattern)
            let business = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.findFirst({
                where: {
                    email: `cafe-${user.id}@example.com`
                }
            });
            // If no business found, create a new one with unique email based on userId
            if (!business) {
                business = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.create({
                    data: {
                        name: "Green Café",
                        type: "CAFE",
                        email: `cafe-${user.id}@example.com`
                    }
                });
                console.log(`[POST /api/waste] Created new business: ${business.id} for user ${user.id}`);
            } else {
                console.log(`[POST /api/waste] Found existing business: ${business.id} for user ${user.id}`);
            }
            // Update user with businessId
            await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.update({
                where: {
                    id: user.id
                },
                data: {
                    businessId: business.id
                }
            });
            user.businessId = business.id;
        }
        const body = await request.json();
        const validatedData = wasteEntrySchema.parse(body);
        // Determine status and availableFor based on waste type
        // Rule: EDIBLE food → CHARITY only, all other types → FARMER only
        // WasteEntry is the source of truth - all entries start with PENDING status
        let status = "PENDING";
        let availableFor = null;
        if (validatedData.actionType === "DROPPED") {
            status = "DROPPED";
        } else {
            // Automatically assign based on waste type
            if (validatedData.wasteType === "EDIBLE") {
                // EDIBLE food goes to CHARITY only
                availableFor = "CHARITY";
                status = "PENDING";
            } else {
                // All other types (COFFEE_GROUNDS, ORGANIC, EXPIRED, RECYCLABLE, PLATE_WASTE) go to FARMER only
                availableFor = "FARMER";
                status = "PENDING";
            }
        }
        // Validate required fields before creating
        if (!user.businessId) {
            console.error("[POST /api/waste] ERROR: user.businessId is null");
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Database error",
                message: "Unable to associate waste entry with a business. Please try again."
            }, {
                status: 500
            });
        }
        if (!user.id) {
            console.error("[POST /api/waste] ERROR: user.id is null");
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Database error",
                message: "User ID is missing. Please log in again."
            }, {
                status: 500
            });
        }
        // Verify user exists in database
        try {
            const userExists = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
                where: {
                    id: user.id
                }
            });
            if (!userExists) {
                console.error("[POST /api/waste] ERROR: User does not exist in database:", user.id);
                return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Database error",
                    message: "User not found. Please log in again."
                }, {
                    status: 500
                });
            }
        } catch (userCheckError) {
            console.error("[POST /api/waste] ERROR checking user:", userCheckError);
        }
        // Verify business exists in database
        try {
            const businessExists = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.findUnique({
                where: {
                    id: user.businessId
                }
            });
            if (!businessExists) {
                console.error("[POST /api/waste] ERROR: Business does not exist in database:", user.businessId);
                return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Database error",
                    message: "Business not found. Please contact support."
                }, {
                    status: 500
                });
            }
        } catch (businessCheckError) {
            console.error("[POST /api/waste] ERROR checking business:", businessCheckError);
        }
        console.log("[POST /api/waste] BEFORE db.wasteEntry.create() - Data:", {
            wasteType: validatedData.wasteType,
            quantity: validatedData.quantity,
            actionType: validatedData.actionType,
            status,
            availableFor,
            businessId: user.businessId,
            loggedById: user.id
        });
        let wasteEntry;
        try {
            // Build data object - only include availableFor if it's not null
            // Handle dates carefully for SQLite
            let entryDate = new Date();
            if (validatedData.date) {
                try {
                    entryDate = new Date(validatedData.date);
                    if (isNaN(entryDate.getTime())) {
                        entryDate = new Date(); // Fallback to now if invalid
                    }
                } catch (e) {
                    entryDate = new Date(); // Fallback to now if parsing fails
                }
            }
            const wasteEntryData = {
                date: entryDate,
                wasteType: validatedData.wasteType,
                quantity: validatedData.quantity,
                actionType: validatedData.actionType,
                status,
                loggedById: user.id,
                businessId: user.businessId
            };
            // Add optional fields
            if (validatedData.subType) {
                wasteEntryData.subType = validatedData.subType;
            }
            if (validatedData.destination) {
                wasteEntryData.destination = validatedData.destination;
            }
            if (validatedData.expiryDate) {
                try {
                    const expiry = new Date(validatedData.expiryDate);
                    if (!isNaN(expiry.getTime())) {
                        wasteEntryData.expiryDate = expiry;
                    }
                } catch (e) {
                    console.warn("[POST /api/waste] Invalid expiry date, skipping:", validatedData.expiryDate);
                }
            }
            if (validatedData.notes) {
                wasteEntryData.notes = validatedData.notes;
            }
            // Only add availableFor if it's not null
            if (availableFor) {
                wasteEntryData.availableFor = availableFor;
            }
            console.log("[POST /api/waste] Creating with data:", JSON.stringify(wasteEntryData, null, 2));
            wasteEntry = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.create({
                data: wasteEntryData,
                include: {
                    loggedBy: {
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
                            type: true
                        }
                    }
                }
            });
            console.log("[POST /api/waste] AFTER db.wasteEntry.create() - Success! Entry ID:", wasteEntry.id);
            console.log("[POST /api/waste] Created entry details:", {
                id: wasteEntry.id,
                wasteType: wasteEntry.wasteType,
                subType: wasteEntry.subType,
                quantity: wasteEntry.quantity,
                actionType: wasteEntry.actionType,
                status: wasteEntry.status,
                availableFor: wasteEntry.availableFor,
                businessId: wasteEntry.businessId
            });
            // Award points based on action type (don't fail if this doesn't work)
            try {
                let points = 0;
                if (validatedData.actionType === "DONATE") {
                    points = Math.floor(validatedData.quantity); // 1 point per kg donated
                } else if (validatedData.actionType === "COMPOST" || validatedData.actionType === "FARM") {
                    points = Math.floor(validatedData.quantity * 0.5); // 0.5 points per kg composted
                } else if (validatedData.actionType === "REUSE") {
                    points = Math.floor(validatedData.quantity * 0.8); // 0.8 points per kg reused
                }
                if (points > 0) {
                    await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].pointsHistory.create({
                        data: {
                            userId: user.id,
                            wasteEntryId: wasteEntry.id,
                            points,
                            reason: `Logged ${validatedData.quantity} kg of ${validatedData.wasteType.toLowerCase()} - ${validatedData.actionType.toLowerCase()}`
                        }
                    });
                    console.log("[POST /api/waste] Points awarded:", points);
                }
            } catch (pointsError) {
                // Don't fail the entire request if points creation fails
                console.error("[POST /api/waste] Failed to create points history (non-critical):", pointsError);
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(wasteEntry, {
                status: 201
            });
        } catch (dbError) {
            console.error("[POST /api/waste] Database error during create:", dbError);
            console.error("[POST /api/waste] Error details:", {
                message: dbError instanceof Error ? dbError.message : String(dbError),
                stack: dbError instanceof Error ? dbError.stack : undefined,
                name: dbError instanceof Error ? dbError.name : undefined
            });
            const errorMessage = dbError instanceof Error ? dbError.message : String(dbError);
            // Check for specific database errors
            let userFriendlyMessage = "Failed to create waste entry";
            if (errorMessage.includes("Foreign key constraint") || errorMessage.includes("foreign key")) {
                userFriendlyMessage = "Invalid user or business. Please log in again.";
            } else if (errorMessage.includes("NOT NULL constraint") || errorMessage.includes("null")) {
                userFriendlyMessage = "Missing required information. Please fill in all fields.";
            } else if (errorMessage.includes("SQLite") || errorMessage.includes("database")) {
                userFriendlyMessage = "Database error. Please try again.";
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Database error",
                message: userFriendlyMessage,
                details: ("TURBOPACK compile-time truthy", 1) ? errorMessage : "TURBOPACK unreachable"
            }, {
                status: 500
            });
        }
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid input data",
                details: error.errors
            }, {
                status: 400
            });
        }
        console.error("[POST /api/waste] Error creating waste entry:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create waste entry",
            message: errorMessage,
            details: ("TURBOPACK compile-time truthy", 1) ? String(error) : "TURBOPACK unreachable"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d551706b._.js.map