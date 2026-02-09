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
            async authorize (credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
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
                const isPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    return null;
                }
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
        async jwt ({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.businessId = user.businessId;
                token.business = user.business;
            }
            return token;
        },
        async session ({ session, token }) {
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
"[project]/FWMS/app/api/marketplace/waste/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
async function GET(request) {
    try {
        console.log("[Marketplace Waste] ===== NEW REQUEST =====");
        // Determine user role: CHARITY or FARMER
        let userRole = null;
        // Try NextAuth session first
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getServerSession"])(__TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authOptions"]);
        console.log("[Marketplace Waste] Session:", session ? "exists" : "none");
        if (session?.user) {
            // Map NextAuth role to CHARITY or FARMER
            // If user has business type NGO → CHARITY, FARM → FARMER
            if (session.user.business?.type === "NGO") {
                userRole = "CHARITY";
            } else if (session.user.business?.type === "FARM") {
                userRole = "FARMER";
            }
        } else {
            // Fallback to x-user-id header (for in-memory auth system)
            const userId = request.headers.get("x-user-id");
            if (!userId) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Unauthorized"
                }, {
                    status: 401
                });
            }
            // Try to get user from database
            try {
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
                    where: {
                        id: userId
                    },
                    include: {
                        business: true
                    }
                });
                if (user) {
                    // Map database business type to role
                    if (user.business?.type === "NGO") {
                        userRole = "CHARITY";
                    } else if (user.business?.type === "FARM") {
                        userRole = "FARMER";
                    }
                }
            } catch (error) {
            // Database lookup failed, continue to in-memory fallback
            }
            // If not found in database, check in-memory users
            if (!userRole) {
                const { users } = await __turbopack_context__.A("[project]/FWMS/app/api/_data.ts [app-route] (ecmascript, async loader)");
                const memUser = users.find((u)=>u.id === userId);
                if (memUser) {
                    // Map in-memory role directly: "charity" → "CHARITY", "farmer" → "FARMER"
                    if (memUser.role === "charity") {
                        userRole = "CHARITY";
                    } else if (memUser.role === "farmer") {
                        userRole = "FARMER";
                    }
                }
            }
        }
        // Only CHARITY and FARMER users can access marketplace
        console.log("[Marketplace Waste] Final userRole:", userRole);
        if (!userRole || userRole !== "CHARITY" && userRole !== "FARMER") {
            console.log("[Marketplace Waste] Invalid userRole, returning 403");
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Only charity and farmer users can access marketplace"
            }, {
                status: 403
            });
        }
        // Try database first, but if it fails immediately, use in-memory
        // We'll use Promise.race to timeout database queries quickly
        let useInMemory = false;
        try {
            console.log(`[Marketplace Waste] Attempting database query for userRole=${userRole}`);
            // Try a quick database ping first - if it fails, skip to in-memory
            const dbPing = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findFirst({
                take: 1
            }).catch(()=>{
                console.log("[Marketplace Waste] Database ping failed, using in-memory");
                useInMemory = true;
                return null;
            });
            // Wait max 1 second for database ping
            await Promise.race([
                dbPing,
                new Promise((resolve)=>setTimeout(()=>{
                        console.log("[Marketplace Waste] Database ping timeout, using in-memory");
                        useInMemory = true;
                        resolve(null);
                    }, 1000))
            ]);
            if (useInMemory) {
                throw new Error("Database unavailable, using in-memory");
            }
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
            // Fetch available waste entries
            // Filter ONLY by:
            // - availableFor === userRole (CHARITY or FARMER)
            // - status === "AVAILABLE"
            // - NOT already requested
            // - NOT expired
            // NO businessId filtering - shows waste from all businesses
            const wasteEntries = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].wasteEntry.findMany({
                where: {
                    availableFor: userRole,
                    status: "AVAILABLE",
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
                            name: true,
                            type: true,
                            address: true
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
            // Transform to match expected format
            const items = wasteEntries.map((entry)=>{
                return {
                    id: entry.id,
                    cafeId: entry.businessId,
                    cafeName: entry.business.name || "Unknown Café",
                    itemName: entry.subType || entry.wasteType.toLowerCase(),
                    type: entry.wasteType.toLowerCase(),
                    quantity: entry.quantity,
                    expiryDate: entry.expiryDate ? entry.expiryDate.toISOString().split("T")[0] : null,
                    status: entry.status.toLowerCase(),
                    description: entry.notes,
                    business: {
                        id: entry.business.id,
                        name: entry.business.name,
                        type: entry.business.type,
                        address: entry.business.address
                    },
                    loggedBy: entry.loggedBy
                };
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(items);
        } catch (dbError) {
            // Fallback to in-memory arrays if database fails
            console.log("[Marketplace Waste] Database failed, using in-memory fallback");
            console.log("[Marketplace Waste] Database error:", dbError instanceof Error ? dbError.message : String(dbError));
            const { wasteLogs, pickupRequests: memPickupRequests, users: memUsers } = await __turbopack_context__.A("[project]/FWMS/app/api/_data.ts [app-route] (ecmascript, async loader)");
            console.log(`[Marketplace Waste] Total waste logs in memory: ${wasteLogs.length}`);
            console.log(`[Marketplace Waste] User role: ${userRole}`);
            const requestedWasteIds = new Set(memPickupRequests.filter((p)=>p.status === "pending" || p.status === "approved").map((p)=>p.wasteId));
            console.log(`[Marketplace Waste] Requested waste IDs: ${Array.from(requestedWasteIds).join(", ") || "none"}`);
            // Map userRole to in-memory assignedTo
            const assignedTo = userRole === "CHARITY" ? "charity" : "farmer";
            console.log(`[Marketplace Waste] Filtering for assignedTo: "${assignedTo}"`);
            // Filter ONLY by:
            // - assignedTo matches userRole (charity or farmer)
            // - status === "pending" (in-memory equivalent of "AVAILABLE")
            // - NOT already requested
            // - NOT expired
            // NO businessId filtering
            const items = wasteLogs.filter((w)=>{
                const matchesAvailableFor = w.assignedTo === assignedTo;
                const isAvailable = w.status === "pending" // In-memory uses "pending" instead of "AVAILABLE"
                ;
                const notRequested = !requestedWasteIds.has(w.id);
                // Check expiry
                let notExpired = true;
                if (w.expiryDate) {
                    const expiry = new Date(w.expiryDate);
                    notExpired = !isNaN(expiry.getTime()) && expiry >= new Date();
                }
                const include = matchesAvailableFor && isAvailable && notRequested && notExpired;
                if (!include && matchesAvailableFor) {
                    console.log(`[Marketplace Waste] Excluding ${w.id} (${w.itemName}): matchesAvailableFor=${matchesAvailableFor}, isAvailable=${isAvailable}, notRequested=${notRequested}, notExpired=${notExpired}`);
                }
                return include;
            }).map((w)=>{
                const cafeUser = memUsers.find((u)=>u.cafeId === w.cafeId);
                return {
                    id: w.id,
                    cafeId: w.cafeId,
                    cafeName: cafeUser?.organizationName || "Green Café",
                    itemName: w.itemName,
                    type: w.type,
                    quantity: w.quantity,
                    expiryDate: w.expiryDate,
                    status: w.status,
                    description: w.notes,
                    business: {
                        id: w.cafeId,
                        name: cafeUser?.organizationName || "Green Café",
                        type: "CAFE",
                        address: null
                    }
                };
            });
            console.log(`[Marketplace Waste] Returning ${items.length} items from in-memory`);
            console.log(`[Marketplace Waste] Items:`, items.map((i)=>`${i.itemName} (${i.quantity} kg, ${i.type})`).join(", ") || "none");
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(items);
        }
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0fe2b3a1._.js.map