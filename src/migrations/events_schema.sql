create type event_type as enum ("webinar", "competition", "gallery");

create table events (
  id uuid primary key default gen_random_uuid(),
  type event_type not null,
  title text not null,
  description text,
  img_url text,
  gallery text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Seed with current events
insert into events (type, title, description, img_url, gallery) values
("webinar", "Preparation Mantra", "Foundational webinar setting the right mindset for aspiring AI practitioners.", "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%202.jpeg", null),
("webinar", "Orientation 2024", "Kickstarting the journey into AIVOLUTIONS with an overview of tracks and goals.", "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%201.jpeg", null),
("competition", "Codex Hackathon", "48-hour buildathon crafting next-gen AI prototypes and demos.", "https://ik.imagekit.io/7lzd57wvb/Aivolutions/Competiton%201.jpeg", null),
("gallery", "Algosphere", "Algorithmic puzzle challenge testing speed, accuracy, and strategy. Participants tackled real-world challenges over multiple rigorous rounds.", "/assets/events/algosphere/pic_1.jpg", array["/assets/events/algosphere/pic_1.jpg", "/assets/events/algosphere/pic_2.jfif", "/assets/events/algosphere/pic_3.jfif", "/assets/events/algosphere/pic_4.jfif"]);
