import db from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await db.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: true,
    },
  });
  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((sum, orderItem) => {
      return sum + Number(orderItem.price) * orderItem.quantity;
    }, 0);
    return total + orderTotal;
  }, 0);
  return totalRevenue;
};
