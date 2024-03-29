import { format } from "date-fns";

import OrderClient from "@/components/order/OrderClient";
import { OrderColumn } from "@/components/order/columns";
import db from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await db.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!orders) return null;

  const formattedOrder: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.name + " x" + orderItem.quantity)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.price) * item.quantity;
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrder} />
      </div>
    </div>
  );
};

export default OrdersPage;
