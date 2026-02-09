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
"[project]/FWMS/app/api/auth/register/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/lib/db.ts [app-route] (ecmascript)");
;
;
const dynamic = "force-dynamic";
async function POST(req) {
    try {
        const body = await req.json().catch(()=>null);
        if (!body) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid request body"
            }, {
                status: 400
            });
        }
        if (!body.email || !body.password || !body.businessName || !body.businessType) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required fields",
                message: "Email, password, business name, and business type are required"
            }, {
                status: 400
            });
        }
        const email = body.email.toLowerCase();
        // Check if user already exists in the real DB
        let existingUser;
        try {
            existingUser = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
                where: {
                    email
                }
            });
        } catch (dbError) {
            console.error("[POST /api/auth/register] Error checking existing user:", dbError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Database error",
                message: "Failed to check if user exists. Please try again."
            }, {
                status: 500
            });
        }
        if (existingUser) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User with this email already exists"
            }, {
                status: 400
            });
        }
        // Check if business with this email exists (Business.email is unique)
        let existingBusiness;
        try {
            existingBusiness = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.findUnique({
                where: {
                    email
                }
            });
        } catch (dbError) {
            console.error("[POST /api/auth/register] Error checking existing business:", dbError);
        // Continue anyway
        }
        // Generate unique business email if user email is already used for a business
        let businessEmail = email;
        if (existingBusiness) {
            // Use a different email format for business to avoid conflict
            const emailParts = email.split('@');
            businessEmail = `${emailParts[0]}+business@${emailParts[1]}`;
            console.log(`[POST /api/auth/register] Business email conflict, using: ${businessEmail}`);
            // Check if this alternative email also exists
            const altBusinessExists = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].business.findUnique({
                where: {
                    email: businessEmail
                }
            });
            if (altBusinessExists) {
                // Use timestamp to make it unique
                businessEmail = `${emailParts[0]}+business-${Date.now()}@${emailParts[1]}`;
                console.log(`[POST /api/auth/register] Alternative email also exists, using: ${businessEmail}`);
            }
        }
        // Map businessType string from the form to our Business.type string
        const bt = (body.businessType || "").toLowerCase();
        let businessType = null;
        if (bt === "cafe") businessType = "CAFE";
        else if (bt === "ngo") businessType = "NGO";
        else if (bt === "farm") businessType = "FARM";
        if (!businessType) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid business type",
                message: "Business type must be one of: cafe, ngo, or farm"
            }, {
                status: 400
            });
        }
        // Determine high-level app role for routing/localStorage
        // (these are the same values used elsewhere on the frontend)
        let appRole = "staff";
        if (businessType === "NGO") appRole = "charity";
        else if (businessType === "FARM") appRole = "farmer";
        // Map to DB user role (string field)
        // We keep three roles at DB level: ADMIN | STAFF | PARTNER
        let dbRole = "STAFF";
        if (appRole === "charity" || appRole === "farmer") {
            dbRole = "PARTNER";
        }
        // Create Business + User in a transaction
        console.log("[POST /api/auth/register] Creating business and user...");
        console.log("[POST /api/auth/register] Business data:", {
            name: body.businessName,
            type: businessType,
            email: businessEmail
        });
        let result;
        try {
            result = await __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].$transaction(async (tx)=>{
                const business = await tx.business.create({
                    data: {
                        name: body.businessName,
                        type: businessType,
                        address: body.address || null,
                        contactPerson: body.contactPerson || null,
                        email: businessEmail
                    }
                });
                console.log("[POST /api/auth/register] Business created:", business.id);
                const user = await tx.user.create({
                    data: {
                        email,
                        password: body.password,
                        name: body.name || body.contactPerson || "New User",
                        role: dbRole,
                        businessId: business.id
                    }
                });
                console.log("[POST /api/auth/register] User created:", user.id);
                return {
                    business,
                    user
                };
            });
        } catch (transactionError) {
            console.error("[POST /api/auth/register] Transaction error:", transactionError);
            throw transactionError // Re-throw to be caught by outer catch
            ;
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Registration successful",
            userId: result.user.id,
            // Frontend expects lowercase roles: "admin" | "staff" | "charity" | "farmer"
            role: appRole,
            organizationName: result.business.name,
            // Use business.id as cafeId equivalent for newer flows
            cafeId: result.business.id
        }, {
            status: 201
        });
    } catch (error) {
        console.error("[POST /api/auth/register] Error:", error);
        console.error("[POST /api/auth/register] Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            name: error instanceof Error ? error.name : undefined
        });
        // Check for specific database errors
        let errorMessage = "Failed to register user";
        if (error instanceof Error) {
            const errorStr = error.message.toLowerCase();
            if (errorStr.includes("unique constraint") || errorStr.includes("unique")) {
                errorMessage = "Email already exists. Please use a different email.";
            } else if (errorStr.includes("foreign key") || errorStr.includes("constraint")) {
                errorMessage = "Database constraint error. Please check your input.";
            } else if (errorStr.includes("sqlite") || errorStr.includes("database")) {
                errorMessage = "Database error. Please try again or contact support.";
            } else {
                errorMessage = error.message;
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to register user",
            message: errorMessage,
            details: ("TURBOPACK compile-time truthy", 1) ? error instanceof Error ? error.message : String(error) : "TURBOPACK unreachable"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__83df4320._.js.map