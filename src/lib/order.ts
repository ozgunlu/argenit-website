import { prisma } from "./db";

/**
 * Shifts order numbers up by 1 for all records at or above the target order.
 * Call this BEFORE inserting/updating a record to make room at the target position.
 *
 * @param model  - Prisma model name (uncapitalized delegate key)
 * @param target - The order number being inserted/moved to
 * @param where  - Optional extra filter (e.g. { categoryId, type })
 * @param excludeId - Optional ID to exclude (for updates — don't shift self)
 */
export async function shiftOrder(
  model: string,
  target: number,
  where: Record<string, unknown> = {},
  excludeId?: string,
) {
  const delegate = (prisma as Record<string, any>)[model];
  if (!delegate) return;

  const filter: Record<string, unknown> = {
    ...where,
    order: { gte: target },
  };
  if (excludeId) {
    filter.id = { not: excludeId };
  }

  await delegate.updateMany({
    where: filter,
    data: { order: { increment: 1 } },
  });
}
