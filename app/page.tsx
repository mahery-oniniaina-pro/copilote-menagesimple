import { loadSamples } from "@/lib/samples";
import { Workspace } from "./ui/Workspace";

export default async function Home() {
  return <Workspace samples={await loadSamples()} />;
}
