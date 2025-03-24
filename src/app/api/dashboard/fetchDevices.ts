import { supabase } from "@/utils/supabaseClient";

export const fetchDevices = async () => {
  try {
    const { data, error } = await supabase.from("user").select("id");
    if (error) throw error;
    return data;
  } catch (e) {
    console.error("Error in fetchDevices: ", e);
    return [];
  }
};
