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
    },
    // Add NEW farmer items WITHOUT pickup requests (these will be available)
    {
        id: "w9",
        cafeId: "cafe-1",
        type: "organic",
        itemName: "Banana Peels",
        quantity: 25,
        expiryDate: "2025-12-20",
        status: "pending",
        assignedTo: "farmer",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "w10",
        cafeId: "cafe-1",
        type: "coffee",
        itemName: "Fresh Coffee Grounds",
        quantity: 30,
        expiryDate: "2025-12-18",
        status: "pending",
        assignedTo: "farmer",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "w11",
        cafeId: "cafe-1",
        type: "organic",
        itemName: "Vegetable Waste",
        quantity: 35,
        expiryDate: "2025-12-25",
        status: "pending",
        assignedTo: "farmer",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    // Add NEW charity items WITHOUT pickup requests (these will be available)
    {
        id: "w12",
        cafeId: "cafe-1",
        type: "edible",
        itemName: "Fresh Sandwiches",
        quantity: 18,
        expiryDate: "2025-12-20",
        status: "pending",
        assignedTo: "charity",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "w13",
        cafeId: "cafe-1",
        type: "edible",
        itemName: "Day-Old Pastries",
        quantity: 22,
        expiryDate: "2025-12-19",
        status: "pending",
        assignedTo: "charity",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "w14",
        cafeId: "cafe-1",
        type: "edible",
        itemName: "Leftover Meals",
        quantity: 15,
        expiryDate: "2025-12-22",
        status: "pending",
        assignedTo: "charity",
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
"[project]/FWMS/app/api/marketplace/waste/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/app/api/_data.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    try {
        // Get user ID from header (in-memory auth system)
        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        // Find user in in-memory data
        const user = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].find((u)=>u.id === userId);
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "User not found"
            }, {
                status: 404
            });
        }
        // Only CHARITY and FARMER users can access marketplace
        if (user.role !== "charity" && user.role !== "farmer") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Only charity and farmer users can access marketplace"
            }, {
                status: 403
            });
        }
        // Filter waste entries:
        // - assignedTo matches user's role (charity or farmer)
        // - status === "pending" (equivalent to "AVAILABLE")
        // - Show ALL pending items, even if they have pickup requests
        // - Show ALL items regardless of expiry (same as admin view)
        // NO businessId filtering - shows waste from all businesses
        console.log(`[Marketplace] User: ${user.id} (${user.role}), Total waste logs: ${__TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wasteLogs"].length}`);
        // Debug: log all waste logs matching the role
        const matchingRole = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wasteLogs"].filter((w)=>w.assignedTo === user.role);
        console.log(`[Marketplace] Items matching role "${user.role}": ${matchingRole.length}`);
        matchingRole.forEach((w)=>{
            console.log(`  - ${w.id}: ${w.itemName}, status=${w.status}, expiry=${w.expiryDate || "none"}`);
        });
        const items = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wasteLogs"].filter((w)=>{
            // Must match assignedTo
            if (w.assignedTo !== user.role) {
                return false;
            }
            // Must be available (status === "pending")
            if (w.status !== "pending") {
                console.log(`[Marketplace] Excluding ${w.id} - status is "${w.status}", not "pending"`);
                return false;
            }
            // Show ALL pending items - don't filter by pickup requests
            // This ensures farmers see all available items from waste log
            return true;
        });
        console.log(`[Marketplace] Filtered to ${items.length} items for ${user.role}`);
        items.forEach((item)=>{
            console.log(`  - ${item.id}: ${item.itemName} (${item.quantity} kg)`);
        });
        const mappedItems = items.map((w)=>{
            const cafeUser = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].find((u)=>u.cafeId === w.cafeId);
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
                },
                cafeContact: cafeUser ? {
                    name: cafeUser.name || "Café Admin",
                    email: cafeUser.email || null,
                    organizationName: cafeUser.organizationName || "Green Café"
                } : {
                    name: "Café Admin",
                    email: null,
                    organizationName: "Green Café"
                }
            };
        });
        console.log(`[Marketplace] Returning ${mappedItems.length} mapped items`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(mappedItems);
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

//# sourceMappingURL=%5Broot-of-the-server%5D__cdbf54f6._.js.map