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
"[project]/FWMS/app/api/transports/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/FWMS/app/api/_data.ts [app-route] (ecmascript)");
;
;
async function GET(req) {
    // Get user ID from header (for admin/staff)
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Missing user ID"
        }, {
            status: 400
        });
    }
    const user = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].find((u)=>u.id === userId);
    if (!user || user.role !== "admin" && user.role !== "staff") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 403
        });
    }
    // Filter transports by cafe if user is staff
    let filteredTransports = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transports"];
    if (user.role === "staff" && user.cafeId) {
        filteredTransports = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transports"].filter((t)=>{
            const pickup = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pickupRequests"].find((p)=>p.id === t.pickupRequestId);
            if (!pickup) return false;
            const waste = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wasteLogs"].find((w)=>w.id === pickup.wasteId);
            return waste?.cafeId === user.cafeId;
        });
    }
    // Enrich with pickup request and waste details
    // Only return transports that are scheduled (pickup-scheduled or scheduled status)
    const enriched = filteredTransports.map((t)=>{
        const pickup = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pickupRequests"].find((p)=>p.id === t.pickupRequestId);
        const waste = pickup ? __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wasteLogs"].find((w)=>w.id === pickup.wasteId) : null;
        const requester = pickup ? __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].find((u)=>u.id === pickup.requesterId) : null;
        const assignedUser = t.assignedTo ? __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].find((u)=>u.id === t.assignedTo) : null;
        return {
            ...t,
            pickupRequest: pickup ? {
                ...pickup,
                itemName: waste?.itemName,
                quantity: waste?.quantity,
                requesterName: requester?.organizationName || requester?.name
            } : null,
            assignedToName: assignedUser?.name || assignedUser?.organizationName
        };
    }).filter((t)=>{
        // Only show scheduled pickups (pickup-scheduled, scheduled, or completed)
        const status = t.status.toLowerCase();
        return status === "scheduled" || status === "pickup-scheduled" || status === "completed";
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(enriched);
}
async function POST(req) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Missing user ID"
        }, {
            status: 400
        });
    }
    const user = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].find((u)=>u.id === userId);
    if (!user || user.role !== "admin" && user.role !== "staff") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Unauthorized"
        }, {
            status: 403
        });
    }
    const body = await req.json();
    if (!body.pickupRequestId || !body.transportType || !body.pickupDate || !body.pickupWindow) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Missing required fields: pickupRequestId, transportType, pickupDate, pickupWindow"
        }, {
            status: 400
        });
    }
    // Verify pickup request exists and is approved
    const pickupRequest = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["pickupRequests"].find((p)=>p.id === body.pickupRequestId);
    if (!pickupRequest) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Pickup request not found"
        }, {
            status: 404
        });
    }
    // Only allow scheduling for approved pickup requests
    if (pickupRequest.status !== "approved") {
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `Cannot schedule pickup for request with status "${pickupRequest.status}". Only approved requests can be scheduled.`
        }, {
            status: 400
        });
    }
    // Check if transport already exists for this pickup request
    const existingTransport = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transports"].find((t)=>t.pickupRequestId === body.pickupRequestId);
    if (existingTransport) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Transport already exists for this pickup request"
        }, {
            status: 400
        });
    }
    // Create new transport
    const now = new Date().toISOString();
    const newTransport = {
        id: `t-${Date.now()}`,
        pickupRequestId: body.pickupRequestId,
        transportType: body.transportType,
        provider: body.provider,
        assignedTo: body.assignedTo,
        pickupDate: body.pickupDate,
        pickupWindow: body.pickupWindow,
        cost: body.cost,
        trackingLink: body.trackingLink,
        notes: body.notes,
        status: "scheduled",
        createdAt: now,
        updatedAt: now
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transports"].push(newTransport);
    // Update pickup request
    pickupRequest.status = "pickup-scheduled";
    pickupRequest.transportId = newTransport.id;
    pickupRequest.pickupWindow = {
        date: body.pickupDate,
        from: body.pickupWindow.from,
        to: body.pickupWindow.to
    };
    // Add activity log
    const waste = __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wasteLogs"].find((w)=>w.id === pickupRequest.wasteId);
    __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["activityLogs"].push({
        id: `a-${Date.now()}`,
        userId: user.id,
        actionType: "approved",
        itemName: waste?.itemName || "Unknown",
        createdAt: now,
        requesterType: pickupRequest.requesterType
    });
    // Create notification for charity/farmer
    const dateStr = new Date(body.pickupDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    const timeStr = `${body.pickupWindow.from} – ${body.pickupWindow.to}`;
    __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$app$2f$api$2f$_data$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["notifications"].push({
        id: `n-${Date.now()}`,
        userId: pickupRequest.requesterId,
        type: "pickup-scheduled",
        title: "Pickup Scheduled",
        message: `Your pickup has been scheduled on ${dateStr} from ${timeStr}.`,
        read: false,
        createdAt: now,
        relatedRequestId: pickupRequest.id
    });
    return __TURBOPACK__imported__module__$5b$project$5d2f$FWMS$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(newTransport, {
        status: 201
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__03ace65d._.js.map