import { HomePage } from "@/components/home/HomePage";
import { getRequestPlatform } from "@/lib/platform";

export default async function Home() {
  const platform = await getRequestPlatform();
  return <HomePage platform={platform} />;
}
