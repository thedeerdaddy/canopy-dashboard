import { NextRequest, NextResponse } from "next/server";

/**
 * Aggregated data endpoint.
 * Returns a full DataPackage combining all platform sources.
 * Currently returns mock data — replace each section with real API calls
 * once integrations are connected (Phase 5 of the build).
 */
export async function GET(req: NextRequest) {
  // TODO Phase 5: Replace mock data with real API calls
  // const guesty = await fetchGuesty();
  // const pricelabs = await fetchPriceLabs();
  // const turno = await fetchTurno();
  // const reviews = await fetchReviews();

  const mockData = {
    portfolio: {
      occupancy: 0.78,
      avgNightlyRate: 247,
      totalRevenue: 142380,
      avgRating: 4.87,
      newBookings: 63,
      cancellationRate: 0.042,
      period: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
    },
    properties: [
      {
        id: "prop-1",
        ownerId: "owner-1",
        name: "Lakefront Lodge on Blue Ridge",
        occupancy: 0.94,
        avgNightlyRate: 389,
        revenue: 28400,
        rating: 4.95,
        topReview: {
          text: "Absolutely perfect. The lake views at sunrise were magical and the kayaks were such a bonus. We're already planning our return trip.",
          author: "Jennifer M.",
          platform: "airbnb",
          stars: 5,
        },
        ownerNote: "Top revenue property this month. Up 12% vs March.",
        badge: "top-revenue",
      },
      {
        id: "prop-2",
        ownerId: "owner-2",
        name: "Mountain View Chalet – Summit",
        occupancy: 0.91,
        avgNightlyRate: 312,
        revenue: 21800,
        rating: 4.98,
        topReview: {
          text: "Peak Paradise thought of everything. The welcome basket, the trail maps, the fire pit — we felt completely taken care of.",
          author: "The Kowalski Family",
          platform: "vrbo",
          stars: 5,
        },
        ownerNote: "Highest-rated property in the portfolio. Perfect guest experience score.",
        badge: "top-rating",
      },
      {
        id: "prop-3",
        ownerId: "owner-3",
        name: "Creekside Cabin – Pigeon Forge",
        occupancy: 0.88,
        avgNightlyRate: 198,
        revenue: 13200,
        rating: 4.91,
        topReview: {
          text: "We've stayed at a lot of cabins. This one wins. Spotless, cozy, and the creek sounds put us to sleep every night.",
          author: "David R.",
          platform: "booking.com",
          stars: 5,
        },
        ownerNote: "Most booked property. Strong repeat guest rate at 31%.",
        badge: "most-booked",
      },
      {
        id: "prop-4",
        ownerId: "owner-4",
        name: "Ridge Runner Retreat",
        occupancy: 0.74,
        avgNightlyRate: 224,
        revenue: 9800,
        rating: 4.78,
        topReview: {
          text: "Great location and views, though the hot tub was out of service.",
          author: "Anonymous",
          platform: "airbnb",
          stars: 4,
        },
        ownerNote: "Hot tub maintenance completed April 3rd. Expect occupancy rebound in May.",
        badge: null,
      },
      {
        id: "prop-5",
        ownerId: "owner-5",
        name: "Smoky Pines Lodge",
        occupancy: 0.81,
        avgNightlyRate: 267,
        revenue: 15600,
        rating: 4.88,
        topReview: {
          text: "Stunning property. We loved waking up to the mountain views every morning.",
          author: "Rachel T.",
          platform: "vrbo",
          stars: 5,
        },
        ownerNote: "Strong month. Summer bookings already at 67% capacity.",
        badge: null,
      },
      {
        id: "prop-6",
        ownerId: "owner-6",
        name: "Sunset Ridge Cabin",
        occupancy: 0.69,
        avgNightlyRate: 178,
        revenue: 7400,
        rating: 4.72,
        topReview: {
          text: "Cozy and quiet — exactly what we needed. Would return.",
          author: "Mark S.",
          platform: "booking.com",
          stars: 4,
        },
        ownerNote: "Occupancy soft this month. Recommend pricing adjustment for May weekdays.",
        badge: null,
      },
      {
        id: "prop-7",
        ownerId: "owner-7",
        name: "The Hendersons' Haven",
        occupancy: 0.86,
        avgNightlyRate: 298,
        revenue: 18200,
        rating: 4.93,
        topReview: {
          text: "This home is perfection. Every detail was considered. Instant rebooking.",
          author: "Sophia L.",
          platform: "airbnb",
          stars: 5,
        },
        ownerNote: "Just hit 100 reviews with 4.93 average — a major milestone worth celebrating.",
        badge: null,
      },
    ],
    market: {
      avgOccupancy: 0.71,
      avgNightlyRate: 218,
      summerDemandDelta: 0.22,
      memorialDayOccupancy: 0.96,
      bookingWindows: {
        Airbnb: 47,
        VRBO: 63,
        "Booking.com": 31,
        Direct: 78,
      },
    },
    ops: {
      cleaningsCompleted: 87,
      avgCleanerRating: 4.92,
      issuesFlagged: 3,
      sameDayTurns: 14,
    },
    reviews: [
      {
        id: "rev-1",
        propertyId: "prop-1",
        text: "Absolutely perfect. The lake views at sunrise were magical.",
        author: "Jennifer M.",
        platform: "airbnb",
        stars: 5,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        replied: false,
      },
      {
        id: "rev-2",
        propertyId: "prop-7",
        text: "This home is perfection. Every detail was considered. Instant rebooking.",
        author: "Sophia L.",
        platform: "airbnb",
        stars: 5,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        replied: false,
      },
      {
        id: "rev-3",
        propertyId: "prop-2",
        text: "Peak Paradise thought of everything. The welcome basket, the trail maps, the fire pit — we felt completely taken care of.",
        author: "The Kowalski Family",
        platform: "vrbo",
        stars: 5,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        replied: true,
      },
    ],
    pulledAt: new Date().toISOString(),
  };

  return NextResponse.json(mockData);
}
