import prisma from "@/app/libs/prismadb";

interface Params {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservations(params: Params) {
  try {
    const { listingId, userId, authorId } = params;

    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listing = { userId: authorId };
    }

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeReservations = reservations.map((reserve) => ({
      ...reserve,
      createdAt: reserve.createdAt.toISOString(),
      startDate: reserve.startDate.toISOString(),
      endDate: reserve.endDate.toISOString(),
      listing: {
        ...reserve.listing,
        createdAt: reserve.createdAt.toISOString(),
      },
    }));

    return safeReservations;
  } catch (error: any) {
    throw new Error(error);
  }
}
