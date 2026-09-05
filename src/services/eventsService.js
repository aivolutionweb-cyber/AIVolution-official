import { supabase } from "../lib/supabaseClient";

const TABLE = "events";

export const fetchEvents = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase fetch error:", error.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    type: row.type,
    title: row.title,
    description: row.description,
    imgUrl: row.img_url,
    gallery: row.gallery || [],
  }));
};

export const addEvent = async (event) => {
  const { data, error } = await supabase.from(TABLE).insert([
    {
      type: event.type,
      title: event.title,
      description: event.description,
      img_url: event.imgUrl,
      gallery: event.gallery || [],
    },
  ]);

  if (error) {
    console.error("Supabase insert error:", error.message);
    return null;
  }

  return data[0];
};
