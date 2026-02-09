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
"[project]/FWMS/app/api/staff/waste/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
                let dbUser = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
                    where: {
                        id: userId
                    },
                    include: {
                        business: true
                    }
                });
                // If user doesn't exist, create a default user and business
                if (!dbUser) {
                    // Find or create a default business
                    let business = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.findFirst({
                        where: {
                            type: "CAFE"
                        }
                    });
                    if (!business) {
                        business = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.create({
                            data: {
                                name: "Green Café",
                                type: "CAFE",
                                email: `cafe-${userId}@example.com`
                            }
                        });
                    }
                    // Create user
                    dbUser = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.create({
                        data: {
                            id: userId,
                            email: `user-${userId}@example.com`,
                            password: "temp",
                            role: "STAFF",
                            businessId: business.id,
                            name: "Staff User"
                        },
                        include: {
                            business: true
                        }
                    });
                }
                if (dbUser) {
                    user = {
                        id: dbUser.id,
                        role: dbUser.role,
                        businessId: dbUser.businessId
                    };
                }
            }
        }
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        if (user.role !== "STAFF" && user.role !== "ADMIN") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Forbidden"
            }, {
                status: 403
            });
        }
        // If user has no businessId, find or create a default business
        if (!user.businessId) {
            let business = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.findFirst({
                where: {
                    type: "CAFE"
                }
            });
            if (!business) {
                business = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.create({
                    data: {
                        name: "Green Café",
                        type: "CAFE",
                        email: `cafe-${user.id}@example.com`
                    }
                });
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
        if (!user.businessId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User business not found"
            }, {
                status: 400
            });
        }
        // Ensure businessId is not null before querying
        if (!user.businessId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User business not found"
            }, {
                status: 400
            });
        }
        // Get all waste entries for this business, sorted by most recent
        console.log(`[GET /api/staff/waste] Querying database for businessId: ${user.businessId}`);
        let wasteEntries;
        try {
            wasteEntries = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.findMany({
                where: {
                    businessId: user.businessId
                },
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
                orderBy: {
                    createdAt: "desc"
                }
            });
            console.log(`[GET /api/staff/waste] Found ${wasteEntries.length} entries`);
        } catch (dbError) {
            console.error("[GET /api/staff/waste] Database error:", dbError);
            throw dbError;
        }
        // Transform to match expected format
        const typeMap = {
            "EDIBLE": "edible",
            "COFFEE_GROUNDS": "coffee",
            "ORGANIC": "organic",
            "EXPIRED": "expired",
            "RECYCLABLE": "recyclable",
            "PLATE_WASTE": "plate_waste"
        };
        const entries = wasteEntries.map((entry)=>{
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
                createdAt: entry.createdAt.toISOString(),
                updatedAt: entry.updatedAt.toISOString(),
                notes: entry.notes || undefined
            };
        });
        const responseData = {
            entries: entries,
            total: entries.length
        };
        console.log(`[GET /api/staff/waste] Returning ${entries.length} entries`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(responseData, {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("[GET /api/staff/waste] Error:", error);
        console.error("[GET /api/staff/waste] Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorResponse = {
            error: "Internal server error",
            message: errorMessage
        };
        console.log("[GET /api/staff/waste] Sending error response:", errorResponse);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(errorResponse, {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
async function POST(req) {
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
            }
        }
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        if (user.role !== "STAFF" && user.role !== "ADMIN") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Only staff and admin can create waste entries"
            }, {
                status: 403
            });
        }
        // If user has no businessId, create or find a default business
        if (!user.businessId) {
            let business = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.findFirst({
                where: {
                    type: "CAFE"
                }
            });
            if (!business) {
                business = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.create({
                    data: {
                        name: "Green Café",
                        type: "CAFE",
                        email: `cafe-${user.id}@example.com`
                    }
                });
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
        const body = await req.json();
        // Basic validation
        const required = [
            "type",
            "itemName",
            "quantity",
            "expiryDate",
            "assignedTo"
        ];
        for (const key of required){
            if (!body[key]) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Missing field: ${key}`
                }, {
                    status: 400
                });
            }
        }
        // Note: assignedTo is now automatically determined by waste type
        // EDIBLE → CHARITY, all other types → FARMER
        // The assignedTo field in the request body is ignored and set automatically
        // Map waste type to database enum
        const wasteTypeMap = {
            edible: "EDIBLE",
            organic: "ORGANIC",
            coffee: "COFFEE_GROUNDS",
            expired: "EXPIRED",
            recyclable: "RECYCLABLE"
        };
        // Map assignedTo to actionType
        const actionTypeMap = {
            charity: "DONATE",
            farmer: "FARM"
        };
        const wasteType = wasteTypeMap[body.type] || "ORGANIC";
        const actionType = actionTypeMap[body.assignedTo] || "FARM";
        // Determine availableFor and status based on waste type
        // Rule: EDIBLE food → CHARITY only, all other types → FARMER only
        // status = PENDING
        let availableFor = null;
        let status = "PENDING";
        // Automatically assign based on waste type
        if (wasteType === "EDIBLE") {
            // EDIBLE food goes to CHARITY only
            availableFor = "CHARITY";
        } else {
            // All other types (ORGANIC, COFFEE_GROUNDS, EXPIRED, RECYCLABLE, PLATE_WASTE) go to FARMER only
            availableFor = "FARMER";
        }
        // Create waste entry in database
        const wasteEntry = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.create({
            data: {
                wasteType,
                subType: body.itemName,
                quantity: Number(body.quantity),
                actionType,
                status,
                ...availableFor && {
                    availableFor
                },
                expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
                notes: body.notes || null,
                loggedById: user.id,
                businessId: user.businessId
            },
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Waste successfully added",
            wasteId: wasteEntry.id,
            waste: wasteEntry
        }, {
            status: 201
        });
    } catch (error) {
        console.error("[POST /api/staff/waste] Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error",
            message: error instanceof Error ? error.message : String(error)
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__79b2894f._.js.map