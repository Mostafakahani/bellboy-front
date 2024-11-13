import { Suspense } from "react";
import ClientBellCleanPage from "@/components/BellClean/ClientClean";
import { fetchCleans } from "./actions";

async function BellCleanage() {
  // Fetch data on server side
  const Cleans = await fetchCleans();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientBellCleanPage planDatas={Cleans} />
    </Suspense>
  );
}

export default BellCleanage;
