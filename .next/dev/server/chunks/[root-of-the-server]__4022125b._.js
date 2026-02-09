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
    "notifications",
    ()=>notifications,
    "pickupRequests",
    ()=>pickupRequests,
    "transports",
    ()=>transports,
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
    },
    // Add more available items for charity
    {
        id: "w5",
        cafeId: "cafe-1",
        type: "edible",
        itemName: "Fresh Bread",
        quantity: 12,
        expiryDate: "2025-12-10",
        status: "pending",
        assignedTo: "charity",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "w6",
        cafeId: "cafe-1",
        type: "edible",
        itemName: "Muffins & Croissants",
        quantity: 20,
        expiryDate: "2025-12-08",
        status: "pending",
        assignedTo: "charity",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    // Add more available items for farmer
    {
        id: "w7",
        cafeId: "cafe-1",
        type: "organic",
        itemName: "Fruit Peels",
        quantity: 15,
        expiryDate: "2025-12-09",
        status: "pending",
        assignedTo: "farmer",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "w8",
        cafeId: "cafe-1",
        type: "coffee",
        itemName: "Used Coffee Grounds",
        quantity: 18,
        expiryDate: "2025-12-07",
        status: "pending",
        assignedTo: "farmer",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
    },
    // Add approved charity request
    {
        id: "p4",
        wasteId: "w5",
        requesterId: "u-charity-1",
        requesterType: "charity",
        requestedAt: new Date().toISOString(),
        status: "approved",
        notes: "Please pack in boxes"
    },
    // Add another approved charity request
    {
        id: "p5",
        wasteId: "w6",
        requesterId: "u-charity-1",
        requesterType: "charity",
        requestedAt: new Date().toISOString(),
        status: "approved"
    },
    // Add approved farmer request
    {
        id: "p6",
        wasteId: "w7",
        requesterId: "u-farmer-1",
        requesterType: "farmer",
        requestedAt: new Date().toISOString(),
        status: "approved"
    },
    // Add another approved farmer request
    {
        id: "p7",
        wasteId: "w8",
        requesterId: "u-farmer-1",
        requesterType: "farmer",
        requestedAt: new Date().toISOString(),
        status: "approved"
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
const transports = [];
const notifications = [];
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
"[project]/FWMS/app/api/staff/waste/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
    try {
        // Try staff first, then admin
        let authResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireStaff"])(req);
        // If staff auth fails, try admin auth
        if (!authResult.user || authResult.response) {
            authResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAdmin"])(req);
        }
        if (!authResult.user || authResult.response) {
            const errorResponse = authResult.response || __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
            errorResponse.headers.set("Content-Type", "application/json");
            return errorResponse;
        }
        const user = authResult.user;
        // Get all waste logs for this cafe, sorted by most recent
        const cafeWaste = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wasteLogs"].filter((w)=>w.cafeId === user.cafeId).sort((a, b)=>b.createdAt.localeCompare(a.createdAt));
        const response = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            entries: cafeWaste,
            total: cafeWaste.length
        });
        response.headers.set("Content-Type", "application/json");
        return response;
    } catch (error) {
        console.error("[GET /api/staff/waste] Error:", error);
        const errorResponse = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error",
            message: error instanceof Error ? error.message : String(error)
        }, {
            status: 500
        });
        errorResponse.headers.set("Content-Type", "application/json");
        return errorResponse;
    }
}
async function POST(req) {
    try {
        const authResult = (0, __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireStaff"])(req);
        if (!authResult.user || authResult.response) {
            return authResult.response || __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const user = authResult.user;
        let body;
        try {
            body = await req.json();
        } catch (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid JSON in request body"
            }, {
                status: 400
            });
        }
        // Basic validation
        const required = [
            "cafeId",
            "staffUserId",
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
        // Validate assignedTo matches type
        if (body.type === "edible" && body.assignedTo !== "charity") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Edible waste must be assigned to 'charity'"
            }, {
                status: 400
            });
        }
        if ((body.type === "organic" || body.type === "coffee") && body.assignedTo !== "farmer") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Organic/coffee waste must be assigned to 'farmer'"
            }, {
                status: 400
            });
        }
        if (!user.cafeId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User is not associated with a cafe"
            }, {
                status: 400
            });
        }
        const now = new Date().toISOString();
        const newWaste = {
            id: `w-${Date.now()}`,
            cafeId: user.cafeId,
            type: body.type,
            itemName: body.itemName,
            quantity: Number(body.quantity),
            expiryDate: body.expiryDate,
            status: "pending",
            assignedTo: body.assignedTo,
            createdAt: now,
            updatedAt: now,
            notes: body.notes
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wasteLogs"].push(newWaste);
        // Debug: Log the created waste item
        console.log(`[Staff Waste] ✅ Created waste item:`, {
            id: newWaste.id,
            itemName: newWaste.itemName,
            type: newWaste.type,
            assignedTo: newWaste.assignedTo,
            status: newWaste.status,
            quantity: newWaste.quantity
        });
        console.log(`[Staff Waste] Total waste logs now: ${__TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wasteLogs"].length}`);
        __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activityLogs"].push({
            id: `a-${Date.now()}`,
            userId: user.id,
            actionType: "logged",
            itemName: newWaste.itemName,
            createdAt: now
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Waste successfully added",
            wasteId: newWaste.id,
            waste: newWaste
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

//# sourceMappingURL=%5Broot-of-the-server%5D__4022125b._.js.map