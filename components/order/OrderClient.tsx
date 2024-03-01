"use client";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { OrderColumn, columns } from "@/components/order/columns";
import { DataTable } from "@/components/ui/dataTable";

interface Props {
  data: OrderColumn[];
}

const OrderClient = ({ data }: Props) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage Orders for your store"
      />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};

export default OrderClient;
