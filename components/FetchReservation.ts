// fetchReservations.ts
// このファイルはサーバーコンポーネントとして扱います
import { createClient } from "@/utils/supabase/server";

export async function fetchReservations(shop: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("shop", shop);

  if (error) {
    console.error("Error fetching reservations:", error);
    return [];
  }

  return data;
}