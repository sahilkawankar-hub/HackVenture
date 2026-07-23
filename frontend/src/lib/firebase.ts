/**
 * Legacy Firebase alias bridging to Supabase.
 */
import { supabase } from "./supabase";

export const auth = supabase.auth;
export default supabase;
