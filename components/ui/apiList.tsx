"use client";

import { useOrigin } from "@/hooks/useOrigin";
import { useParams } from "next/navigation";

import ApiAlert from "@/components/ui/apiAlert";

interface Props {
  entityName: string;
  entityIdName: string;
}

const ApiList = ({ entityName, entityIdName }: Props) => {
  const params = useParams();
  const origin = useOrigin();

  const baseurl = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseurl}/${entityName}`}
      />

      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseurl}/${entityName}/<${entityIdName}>`}
      />

      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseurl}/${entityName}`}
      />

      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseurl}/${entityName}/<${entityIdName}>`}
      />

      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseurl}/${entityName}/<${entityIdName}>`}
      />
    </>
  );
};

export default ApiList;
