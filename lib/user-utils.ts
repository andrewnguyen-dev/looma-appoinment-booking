import { auth } from "@/lib/auth";
import prisma from "@/db";
import { Role } from "@prisma/client";

export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(),
    });
    return session?.user || null;
  } catch {
    return null;
  }
}

export async function getUserMemberships(userId: string) {
  return prisma.membership.findMany({
    where: { userId },
    include: {
      salon: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

export async function hasRole(userId: string, role: Role, salonId?: string) {
  const where: {
    userId: string;
    role: Role;
    salonId?: string;
  } = {
    userId,
    role,
  };
  
  if (salonId) {
    where.salonId = salonId;
  }

  const membership = await prisma.membership.findFirst({ where });
  return !!membership;
}

export async function isOwner(userId: string, salonId?: string) {
  return hasRole(userId, "OWNER", salonId);
}

export async function isStaff(userId: string, salonId?: string) {
  return hasRole(userId, "STAFF", salonId);
}

export async function isStaffOrOwner(userId: string, salonId?: string) {
  const isOwner = await hasRole(userId, "OWNER", salonId);
  const isStaff = await hasRole(userId, "STAFF", salonId);
  return isOwner || isStaff;
}

export async function getUserSalons(userId: string, role?: Role) {
  const where: {
    userId: string;
    role?: Role;
  } = { userId };
  
  if (role) {
    where.role = role;
  }

  const memberships = await prisma.membership.findMany({
    where,
    include: {
      salon: true,
    },
  });

  return memberships.map(m => m.salon);
}

export async function getOwnerSalonOrThrow(userId: string) {
  const salons = await getUserSalons(userId, "OWNER");
  const salon = salons[0];

  if (!salon) {
    throw new Error("No salon found for user");
  }

  return salon;
}
