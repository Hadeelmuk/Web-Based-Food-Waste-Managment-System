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
"[project]/FWMS/app/api/admin/transportations/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
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
const dynamic = "force-dynamic";
const createTransportSchema = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    pickupRequestId: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Pickup request ID is required"),
    scheduledDate: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Scheduled date is required"),
    scheduledTime: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    driverName: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    notes: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    // For admin override (when no approved pickups exist)
    isAdminOverride: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].boolean().optional(),
    manualDestination: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional(),
    manualQuantity: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().optional(),
    manualWasteType: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().optional()
});
async function getUserFromRequest(request) {
    const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
    if (session?.user) {
        return {
            id: session.user.id,
            role: session.user.role,
            businessId: session.user.businessId
        };
    }
    const userId = request.headers.get("x-user-id");
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
                return {
                    id: dbUser.id,
                    role: dbUser.role,
                    businessId: dbUser.businessId
                };
            }
        } catch (error) {
            console.error(`[admin/transportations] Error looking up user ${userId}:`, error);
        }
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
        if (user.role !== "STAFF" && user.role !== "ADMIN") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Forbidden"
            }, {
                status: 403
            });
        }
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const where = {};
        // Filter by business for non-admin
        if (user.role !== "ADMIN" && user.businessId) {
            where.businessId = user.businessId;
        }
        if (status && status !== "all") {
            where.status = status.toUpperCase();
        }
        const transportations = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].transportation.findMany({
            where,
            include: {
                pickupRequest: {
                    include: {
                        requester: {
                            select: {
                                id: true,
                                name: true,
                                business: {
                                    select: {
                                        id: true,
                                        name: true,
                                        type: true,
                                        address: true
                                    }
                                }
                            }
                        },
                        wasteEntry: {
                            select: {
                                id: true,
                                wasteType: true,
                                subType: true,
                                quantity: true,
                                status: true
                            }
                        }
                    }
                },
                wasteEntry: {
                    select: {
                        id: true,
                        wasteType: true,
                        subType: true,
                        quantity: true,
                        status: true
                    }
                },
                business: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdBy: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                assignedTo: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        // Transform for frontend
        const items = transportations.map((t)=>{
            const pickupReq = t.pickupRequest;
            const requesterBusiness = pickupReq?.requester?.business;
            const wasteEntry = t.wasteEntry || pickupReq?.wasteEntry;
            return {
                id: t.id,
                pickupRequestId: t.pickupRequestId,
                wasteEntryId: t.wasteEntryId || pickupReq?.wasteEntry?.id,
                requesterName: requesterBusiness?.name || pickupReq?.requester?.name || t.destination || "Unknown",
                requesterType: requesterBusiness?.type === "NGO" ? "charity" : "farmer",
                requesterAddress: requesterBusiness?.address || null,
                wasteType: wasteEntry?.wasteType || "Unknown",
                itemName: wasteEntry?.subType || wasteEntry?.wasteType || "Unknown",
                quantity: t.quantity || wasteEntry?.quantity || 0,
                cafeName: t.business?.name || "Unknown",
                destination: t.destination,
                scheduledDate: t.scheduledDate?.toISOString() || null,
                scheduledTime: t.scheduledTime || null,
                driverName: t.assignedTo?.name || null,
                status: t.status,
                completedAt: t.completedAt?.toISOString() || null,
                notes: t.notes || null,
                createdAt: t.createdAt.toISOString()
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            transportations: items,
            count: items.length
        });
    } catch (error) {
        console.error("[admin/transportations] GET Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch transportations"
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const user = await getUserFromRequest(request);
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
        // Find user's businessId if not set
        let businessId = user.businessId;
        if (!businessId) {
            const wasteEntry = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.findFirst({
                where: {
                    loggedById: user.id
                },
                select: {
                    businessId: true
                }
            });
            if (wasteEntry?.businessId) {
                businessId = wasteEntry.businessId;
                await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        businessId
                    }
                });
            } else {
                const cafe = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.findFirst({
                    where: {
                        type: "CAFE"
                    }
                });
                if (cafe) {
                    businessId = cafe.id;
                    await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            businessId
                        }
                    });
                }
            }
        }
        if (!businessId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Business not found"
            }, {
                status: 400
            });
        }
        const body = await request.json();
        const validatedData = createTransportSchema.parse(body);
        // Find the pickup request
        const pickupRequest = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].pickupRequest.findUnique({
            where: {
                id: validatedData.pickupRequestId
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        name: true,
                        business: {
                            select: {
                                id: true,
                                name: true,
                                type: true,
                                address: true
                            }
                        }
                    }
                },
                wasteEntry: {
                    select: {
                        id: true,
                        wasteType: true,
                        subType: true,
                        quantity: true,
                        businessId: true
                    }
                },
                transportation: true
            }
        });
        if (!pickupRequest) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Pickup request not found"
            }, {
                status: 404
            });
        }
        // Check if transportation already exists
        if (pickupRequest.transportation) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Transportation already exists for this pickup request"
            }, {
                status: 400
            });
        }
        // Verify pickup is APPROVED (unless admin override)
        if (pickupRequest.status !== "APPROVED" && !validatedData.isAdminOverride) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Pickup request must be APPROVED before creating transportation",
                currentStatus: pickupRequest.status
            }, {
                status: 400
            });
        }
        // Get destination from requester's business
        const destination = pickupRequest.requester?.business?.name || pickupRequest.requester?.name || validatedData.manualDestination || "Unknown";
        // Get quantity from waste entry
        const quantity = pickupRequest.wasteEntry?.quantity || validatedData.manualQuantity || 0;
        // Create transportation record
        const transportation = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].transportation.create({
            data: {
                pickupRequestId: pickupRequest.id,
                wasteEntryId: pickupRequest.wasteEntryId,
                businessId: pickupRequest.wasteEntry?.businessId || businessId,
                destination,
                quantity,
                scheduledDate: new Date(validatedData.scheduledDate),
                scheduledTime: validatedData.scheduledTime || null,
                status: "SCHEDULED",
                notes: validatedData.notes || `Driver: ${validatedData.driverName || "Not assigned"}`,
                createdById: user.id
            },
            include: {
                pickupRequest: {
                    include: {
                        requester: {
                            select: {
                                id: true,
                                name: true,
                                business: {
                                    select: {
                                        name: true,
                                        type: true
                                    }
                                }
                            }
                        },
                        wasteEntry: {
                            select: {
                                id: true,
                                wasteType: true,
                                subType: true,
                                quantity: true
                            }
                        }
                    }
                },
                business: {
                    select: {
                        name: true
                    }
                }
            }
        });
        console.log(`[admin/transportations] Created transportation ${transportation.id} for pickup ${pickupRequest.id}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            transportation: {
                id: transportation.id,
                pickupRequestId: transportation.pickupRequestId,
                wasteEntryId: transportation.wasteEntryId,
                destination: transportation.destination,
                quantity: transportation.quantity,
                scheduledDate: transportation.scheduledDate?.toISOString(),
                scheduledTime: transportation.scheduledTime,
                status: transportation.status
            }
        }, {
            status: 201
        });
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid input",
                details: error.errors
            }, {
                status: 400
            });
        }
        console.error("[admin/transportations] POST Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create transportation"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4fd5269d._.js.map