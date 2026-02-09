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
"[project]/FWMS/app/api/_data.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activityLogs",
    ()=>activityLogs,
    "pickupRequests",
    ()=>pickupRequests,
    "users",
    ()=>users,
    "wasteLogs",
    ()=>wasteLogs
]);
const users = [
    {
        id: "u-admin-1",
        name: "Alice Admin",
        email: "alice@greencafe.com",
        passwordHash: "password",
        role: "admin",
        organizationName: "Green Café",
        cafeId: "cafe-1"
    },
    {
        id: "u-staff-1",
        name: "Sam Staff",
        email: "sam@greencafe.com",
        passwordHash: "password",
        role: "staff",
        organizationName: "Green Café",
        cafeId: "cafe-1"
    },
    {
        id: "u-charity-1",
        name: "Charlie Charity",
        email: "charity@help.org",
        passwordHash: "password",
        role: "charity",
        organizationName: "Hope Charity",
        cafeId: null
    },
    {
        id: "u-farmer-1",
        name: "Fiona Farmer",
        email: "farm@soil.com",
        passwordHash: "password",
        role: "farmer",
        organizationName: "Soil & Co",
        cafeId: null
    }
];
const wasteLogs = [
    {
        id: "w1",
        cafeId: "cafe-1",
        type: "edible",
        itemName: "Pastries",
        quantity: 15,
        expiryDate: "2025-12-05",
        status: "pending",
        assignedTo: "charity",
        createdAt: "2025-12-01T08:00:00Z",
        updatedAt: "2025-12-01T08:00:00Z"
    },
    {
        id: "w2",
        cafeId: "cafe-1",
        type: "organic",
        itemName: "Vegetable Scraps",
        quantity: 22,
        expiryDate: "2025-12-04",
        status: "pending",
        assignedTo: "farmer",
        createdAt: "2025-12-01T09:00:00Z",
        updatedAt: "2025-12-01T09:00:00Z"
    },
    {
        id: "w3",
        cafeId: "cafe-1",
        type: "coffee",
        itemName: "Coffee Grounds",
        quantity: 10,
        expiryDate: "2025-12-03",
        status: "collected",
        assignedTo: "farmer",
        createdAt: "2025-11-30T10:00:00Z",
        updatedAt: "2025-12-01T10:00:00Z"
    },
    {
        id: "w4",
        cafeId: "cafe-1",
        type: "edible",
        itemName: "Sandwiches",
        quantity: 8,
        expiryDate: "2025-12-02",
        status: "dropped",
        assignedTo: "charity",
        createdAt: "2025-11-30T11:00:00Z",
        updatedAt: "2025-12-01T11:00:00Z"
    }
];
const pickupRequests = [
    {
        id: "p1",
        wasteId: "w1",
        requesterId: "u-charity-1",
        requesterType: "charity",
        requestedAt: "2025-12-01T12:00:00Z",
        status: "pending",
        preferredTime: "Morning"
    },
    {
        id: "p2",
        wasteId: "w2",
        requesterId: "u-farmer-1",
        requesterType: "farmer",
        requestedAt: "2025-12-01T13:00:00Z",
        status: "approved"
    },
    {
        id: "p3",
        wasteId: "w3",
        requesterId: "u-farmer-1",
        requesterType: "farmer",
        requestedAt: "2025-11-30T13:00:00Z",
        status: "collected"
    }
];
const activityLogs = [
    {
        id: "a1",
        userId: "u-staff-1",
        actionType: "logged",
        itemName: "Pastries",
        createdAt: "2025-12-01T08:00:00Z"
    },
    {
        id: "a2",
        userId: "u-charity-1",
        actionType: "donationRequested",
        itemName: "Pastries",
        createdAt: "2025-12-01T12:05:00Z"
    },
    {
        id: "a3",
        userId: "u-farmer-1",
        actionType: "farmRequest",
        itemName: "Vegetable Scraps",
        createdAt: "2025-12-01T13:05:00Z"
    },
    {
        id: "a4",
        userId: "u-admin-1",
        actionType: "dropped",
        itemName: "Sandwiches",
        createdAt: "2025-12-01T14:00:00Z"
    }
];
}),
"[project]/FWMS/app/api/_auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getUser",
    ()=>getUser,
    "requireAdmin",
    ()=>requireAdmin,
    "requireCharity",
    ()=>requireCharity,
    "requireFarmer",
    ()=>requireFarmer,
    "requireStaff",
    ()=>requireStaff
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/app/api/_data.ts [app-route] (ecmascript)");
;
;
function getUser(req) {
    const userId = req.headers.get("x-user-id");
    if (!userId) return null;
    return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].find((u)=>u.id === userId) || null;
}
function requireRole(req, role) {
    const user = getUser(req);
    if (!user) {
        return {
            user: null,
            response: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            })
        };
    }
    if (user.role !== role) {
        return {
            user: null,
            response: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `Forbidden: ${role} only`
            }, {
                status: 403
            })
        };
    }
    return {
        user,
        response: null
    };
}
function requireAdmin(req) {
    const base = requireRole(req, "admin");
    if (!base.user || base.response) return base;
    if (!base.user.cafeId) {
        return {
            user: null,
            response: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Admin has no cafe assigned"
            }, {
                status: 400
            })
        };
    }
    return base;
}
function requireStaff(req) {
    const base = requireRole(req, "staff");
    if (!base.user || base.response) return base;
    if (!base.user.cafeId) {
        return {
            user: null,
            response: __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Staff has no cafe assigned"
            }, {
                status: 400
            })
        };
    }
    return base;
}
function requireCharity(req) {
    return requireRole(req, "charity");
}
function requireFarmer(req) {
    return requireRole(req, "farmer");
}
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
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/app/api/_auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/app/api/_data.ts [app-route] (ecmascript)");
;
;
;
async function GET(req) {
    const { user, response } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireFarmer"])(req);
    if (!user || response) return response;
    const items = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pickupRequests"].filter((p)=>p.requesterId === user.id && p.requesterType === "farmer").sort((a, b)=>b.requestedAt.localeCompare(a.requestedAt));
    return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(items);
}
async function POST(req) {
    const { user, response } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireFarmer"])(req);
    if (!user || response) return response;
    const body = await req.json();
    if (!body.wasteId || !body.requesterId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Missing wasteId or requesterId"
        }, {
            status: 400
        });
    }
    if (body.requesterId !== user.id) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Forbidden: requesterId must match authenticated user"
        }, {
            status: 403
        });
    }
    const waste = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wasteLogs"].find((w)=>w.id === body.wasteId);
    if (!waste) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Waste item not found"
        }, {
            status: 404
        });
    }
    // Validate waste is available for farmer
    if (!((waste.type === "organic" || waste.type === "coffee") && waste.status === "pending" && waste.assignedTo === "farmer")) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Waste item is not available for farm pickup"
        }, {
            status: 400
        });
    }
    // Check if this waste already has a pickup request
    const existingRequest = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pickupRequests"].find((p)=>p.wasteId === waste.id);
    if (existingRequest) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "This waste item already has a pickup request"
        }, {
            status: 400
        });
    }
    const now = new Date().toISOString();
    const newRequest = {
        id: `p-${Date.now()}`,
        wasteId: waste.id,
        requesterId: user.id,
        requesterType: "farmer",
        requestedAt: now,
        status: "pending",
        preferredTime: body.preferredTime,
        notes: body.notes
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pickupRequests"].push(newRequest);
    // Add activity log with pickupRequested action
    __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activityLogs"].push({
        id: `a-${Date.now()}`,
        userId: user.id,
        actionType: "pickupRequested",
        itemName: waste.itemName,
        requesterType: "farmer",
        createdAt: now
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(newRequest, {
        status: 201
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0865f58b._.js.map