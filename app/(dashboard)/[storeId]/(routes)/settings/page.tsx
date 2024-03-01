import db from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import SettingsForm from "@/components/forms/SettingsForm";

interface Props {
  params: { storeId: string };
}

const SettingsPage = async ({ params }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm originalStore={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
