// Static event catalogue. Lives in its own module so the homepage carousel
// can import it without pulling the whole Events page (Supabase client,
// registration modal, animate.css) into the initial bundle.
export const EVENTS = [
  {
    type: "competition",
    featured: true,
    registrationOpen: false,
    registrationKind: "team",
    title: "Codex Hackathon 2025",
    date: "18–19 Sep 2025",
    summary:
      "AIvolutions' flagship 2-day hackathon — 60+ teams, a live grand finale, and ₹19,000+ in prizes.",
    facts: ["60+ Teams", "2 Days", "₹19,000+ Prize Pool", "12 Finalists"],
    sections: [
      {
        heading: "The Event",
        body: "The CODEX Hackathon 2025, organized by AIvolutions — the official AI society of MAIT's Department of CSE-AI — was conducted on 18th–19th September 2025. This two-day flagship event brought together aspiring coders, innovators, and technology enthusiasts from the CSE-AI, CSE-DS, and CSE-AIML streams to collaborate, innovate, and build impactful technological solutions.",
      },
      {
        heading: "Rounds & Judging",
        body: "Over 60 teams competed in Round 1. Following a competitive selection process, 43 teams qualified for Round 2 on day one, and the top 12 advanced to the Grand Finale on 19th September, presenting their solutions live to a distinguished panel of judges. Throughout, participants had access to expert faculty mentorship, refining their ideas from ideation to implementation.",
      },
      {
        heading: "Winners & Credits",
        body: "Winners were recognized with a ₹19,000+ prize pool: 1st Prize (₹10,000) to Team RADICALS, 2nd Prize (₹5,000) to Team Digital Destroyers, and the Neighborly Choice Award (₹4,000) to Team NexaGen. The event was made possible by faculty coordinators Dr. Nitin Garg, Dr. Tina Dudeja, Dr. Nitish Uppal, and Dr. Anshu Khurana, under the leadership of Dr. Vinay Kumar Saini, HOD of CSE-AI & DS, with Neighborly Pvt. Ltd. as sponsor.",
      },
    ],
    imgUrl: "/assets/events/codex-2025/poster.jpg",
    id: "CMP_002",
    gallery: [
      "/assets/events/codex-2025/poster.jpg",
      "/assets/events/codex-2025/winners_1.jpg",
      "/assets/events/codex-2025/winners_2.jpg",
      "/assets/events/codex-2025/team_group.jpg",
      "/assets/events/codex-2025/mentoring.jpg",
      "/assets/events/codex-2025/guests.jpg",
    ],
  },
  {
    type: "competition",
    registrationOpen: false,
    registrationKind: "team",
    title: "The Coding Triathlon",
    date: "23–25 Mar 2025",
    summary:
      "A 3-day escalating challenge series — GitHub relay, live quiz, bug bounty, and a Level-Up finale.",
    facts: ["3 Days", "60+ Participants / Day", "GitHub Relay", "Bug Bounty", "Live Quiz"],
    sections: [
      {
        heading: "Overview",
        body: "\"The Coding Triathlon\" was a three-day technical event held from 23rd–25th March 2025, designed as a progressive challenge series where each day introduced a distinct technical dimension of escalating difficulty. Sessions consistently drew 60+ participants per day.",
      },
      {
        heading: "Day by Day",
        body: "Day 1 paired a GitHub Relay — a team-based activity covering repository creation, branching, pull requests, and conflict resolution — with an industry-academia session from DUCAT experts Mr. Sandeep and Mr. Deepak on Agentic AI, including a live hands-on demo of an AI chatbot's tool-calling in action. Day 2 brought a Kahoot-based live Quiz Competition spanning DSA, OS, Computer Networks, DBMS, and AI, followed by a Bug Bounty Challenge debugging real code across Python, JavaScript, and SQL. Day 3 culminated in a Level-Up format final — a multi-tiered showdown blending logical reasoning, algorithms, and rapid-fire coding — closing with a formal prize and medal distribution.",
      },
      {
        heading: "Organizers & Outlook",
        body: "The event was organized by Aivolutions under Faculty Coordinator Dr. Nitin Garg and HOD Dr. Vinay Kumar Saini, and is recommended for adoption as an annual event given its strong engagement and industry participation.",
      },
    ],
    imgUrl: "/assets/events/coding-triathlon/day1_guests.jpg",
    id: "CMP_TRI",
    gallery: [
      "/assets/events/coding-triathlon/day1_guests.jpg",
      "/assets/events/coding-triathlon/day1_group.jpg",
      "/assets/events/coding-triathlon/day1_interactive.jpg",
      "/assets/events/coding-triathlon/day2_session.jpg",
      "/assets/events/coding-triathlon/day2_lab.jpg",
      "/assets/events/coding-triathlon/day3_finale.jpg",
      "/assets/events/coding-triathlon/day3_group.jpg",
      "/assets/events/coding-triathlon/day3_prize_1.jpg",
      "/assets/events/coding-triathlon/day3_prize_2.jpg",
    ],
  },
  {
    type: "gallery",
    registrationOpen: false,
    registrationKind: "team",
    title: "Algosphere",
    date: "22 Mar – Apr 2025",
    summary:
      "AI & Data Analytics hackathon — 24 students, live judging, ₹6,000+ prize pool.",
    facts: ["24 Students", "₹6,000+ Prize Pool", "Multi-Round Format"],
    sections: [
      {
        heading: "Overview",
        body: "ALGOSPHERE'25, presented by AIvolutions × DataAnalytix, was MAIT's AI & Data Analytics hackathon, bringing together 24 students across AI&DS, CSE-AI, and CSE-DS for a multi-round challenge in innovative thinking and real-world problem-solving.",
      },
      {
        heading: "Rounds & Judging",
        body: "Registrations closed on 12th March 2025, followed by a preliminary round on 22nd March testing conceptual clarity and analytical thinking. The final round, held in the first week of April, saw shortlisted teams present fully developed solutions in Ethical AI, Smart Systems, and Data-Centric Innovation through live coding and real-time presentations, guided by dedicated mentors and evaluated live by a panel of expert judges.",
      },
      {
        heading: "Prizes & Credits",
        body: "With a prize pool of ₹6,000+, winning teams were recognized for innovation, technical execution, and collaborative spirit. The event was made possible by faculty coordinators Dr. Anshu Khurana, Mr. Nitish Uppal, Dr. Nitin Garg, and Ms. Tina Dudeja, under the guidance of Dr. Vinay Kumar Saini, Head of the CSE-AI & DS Department.",
      },
    ],
    imgUrl: "/assets/events/algosphere/report_1.jpg",
    id: "DIR_ALGO",
    gallery: [
      "/assets/events/algosphere/report_1.jpg",
      "/assets/events/algosphere/report_3.jpg",
      "/assets/events/algosphere/report_5.jpg",
    ],
  },
  {
    type: "workshop",
    registrationOpen: false,
    registrationKind: "solo",
    title: "Metaverse — Game Development",
    date: "25 Nov 2024",
    summary:
      "A hands-on dive into game dev fundamentals and immersive Metaverse experiences.",
    facts: ["Hands-On Workshop", "VR / Metaverse Demo"],
    sections: [
      {
        heading: "Overview",
        body: "On 25th November 2024, AIvolutions hosted \"Metaverse — Game Development\", bringing together tech enthusiasts, coders, and gamers for an interactive deep dive into game development and immersive virtual environments.",
      },
      {
        heading: "What Happened",
        body: "Dr. Vinay Kumar Saini opened the session emphasizing hands-on learning and the integration of AI with next-generation technologies. Participants were then introduced to game design principles, animation and interactive graphics basics, and AI's role in adaptive game environments — including a live walkthrough of a Metaverse-based virtual world.",
      },
      {
        heading: "Hands-On & Credits",
        body: "The hands-on portion had teams collaborating on creative ideas and playing games together in real time, reinforcing the session's blend of learning and play. The event was guided by faculty coordinators Dr. Nitin Garg, Ms. Tina Dudeja, and Dr. Anshu Khurana, and organized by the AIVOLUTIONARIES core team.",
      },
    ],
    imgUrl: "/assets/events/metaverse/group.jpg",
    id: "WRK_META",
    gallery: [
      "/assets/events/metaverse/group.jpg",
      "/assets/events/metaverse/vr_demo.jpg",
      "/assets/events/metaverse/address.jpg",
    ],
  },
  {
    type: "webinar",
    registrationOpen: false,
    registrationKind: "solo",
    title: "Enterprise Application Suite",
    date: "20 Feb 2025",
    summary:
      "An STMicroelectronics expert on how large enterprises run on ERP — architecture to career paths.",
    facts: ["Industry Keynote", "STMicroelectronics", "ERP Deep-Dive"],
    sections: [
      {
        heading: "Overview",
        body: "On 20th February 2025, AIvolutions hosted \"Introduction to Enterprise Application Suite\", an industry session on Enterprise Resource Planning (ERP) software featuring a guest speaker from STMicroelectronics, a global technology company.",
      },
      {
        heading: "The Keynote",
        body: "Keynote speaker Ms. Parul Mehndiratta, Business Enterprise Architect at STMicroelectronics, walked students through ERP fundamentals and architecture, its role in managing finance, HR, and supply chain, the shift toward cloud-based and AI-integrated ERP, and real-world examples of how multinational corporations deploy these systems at scale — along with career guidance for students eyeing the enterprise software domain.",
      },
      {
        heading: "Wrap-Up & Credits",
        body: "An open Q&A followed, and all attendees received participation certificates and AIvolutions membership access. The session was organized under the guidance of Dr. Vinay Kumar Saini, with support from Dr. Nitin Garg, Dr. Nitish Uppal, Ms. Tina Dudeja, and Dr. Anshu Khurana.",
      },
    ],
    imgUrl: "/assets/events/erp-suite/keynote.jpg",
    id: "WEB_ERP",
    gallery: [
      "/assets/events/erp-suite/keynote.jpg",
      "/assets/events/erp-suite/handover.jpg",
      "/assets/events/erp-suite/session.jpg",
    ],
  },
  {
    type: "visit",
    registrationOpen: false,
    registrationKind: "solo",
    title: "Industrial Visit — DUCAT Pitampura",
    date: "18 Oct 2024",
    summary:
      "Hands-on AI/ML/NLP session and live problem-solving at DUCAT's industry training campus.",
    facts: ["Industrial Visit", "ML · CV · NLP", "Live Problem-Solving"],
    sections: [
      {
        heading: "Overview",
        body: "On 18th October 2024, students from MAIT's Department of Artificial Intelligence visited DUCAT Pitampura, a premier IT training institute, to explore real-world applications of AI — including Machine Learning, Computer Vision, Deep Learning, and Natural Language Processing.",
      },
      {
        heading: "Hands-On Session",
        body: "The session opened with a deep dive into ML (supervised/unsupervised learning), Computer Vision (CNNs, object detection), Deep Learning, and NLP (chatbots, sentiment analysis). Students then split into teams for a hands-on, real-time problem-solving challenge, applying the concepts they'd just learned to a live problem statement.",
      },
      {
        heading: "Feedback & Credits",
        body: "Each team presented their solutions to DUCAT trainers and industry experts, receiving feedback on algorithm accuracy, deployment practices, and scalability — bridging classroom theory with industry expectations. The visit was made possible through the guidance of Dr. Vinay Kumar Saini and Dr. Nitin Garg.",
      },
    ],
    imgUrl: "/assets/events/ducat-visit/session.jpg",
    id: "VST_DUCAT",
    gallery: [
      "/assets/events/ducat-visit/session.jpg",
      "/assets/events/ducat-visit/discussion_1.jpg",
      "/assets/events/ducat-visit/discussion_2.jpg",
    ],
  },
  {
    type: "webinar",
    registrationOpen: false,
    registrationKind: "solo",
    title: "Orientation 2024",
    date: "29 Sep 2024",
    summary:
      "Kickstarting the journey into AIVOLUTIONS — core team intros, guest talks, and the year's roadmap.",
    facts: ["Society Kickoff", "Core Team Intro", "Open Q&A"],
    sections: [
      {
        heading: "Overview",
        body: "Held on 29th September 2024, the AIvolutions Orientation Event marked the beginning of a new chapter for the AI society at MAIT — welcoming new members, introducing the core team, and sharing the society's vision for the year ahead.",
      },
      {
        heading: "Highlights",
        body: "Dr. Vinay Saini, Head of the AI & DS Department, opened with an address on hands-on learning and industry exposure, followed by the core team unveiling the year's lineup: AI hackathons, \"Code in the Dark\" coding competitions, technical workshops (including a special Microsoft session), and robotics/AI integration projects. Guest speaker Ms. Tushika (Founder, 15FORTEEN) shared strategies for balancing academics with co-curricular pursuits, and senior member Jinal Gupta spoke about her own growth through the society.",
      },
      {
        heading: "Closing",
        body: "The event closed with an open Q&A and a strong foundation set for the year, leaving new members clear on the society's goals and inspired to get involved.",
      },
    ],
    imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%201.jpeg",
    id: "WEB_002",
  },
  {
    type: "webinar",
    registrationOpen: false,
    registrationKind: "solo",
    title: "Preparation Mantra",
    date: "27 May 2025",
    summary:
      "Jinal Gupta's exam-season webinar on smart prep, time management, and scoring technique.",
    facts: ["Exam Prep Webinar", "Time Management", "Live Q&A"],
    sections: [
      {
        heading: "Overview",
        body: "On 27th May 2025, AIvolutions, in collaboration with DataAnalytix, conducted an exclusive webinar titled \"Preparation Mantra — Unlock Your Exam Success!\" to help students navigate end-semester exams with practical, effective strategies.",
      },
      {
        heading: "What Was Covered",
        body: "The session was led by Jinal Gupta, a senior AIvolutions member known for balancing academic excellence with co-curricular activity. She covered smart exam preparation tips, effective time management, maintaining a strong CGPA through consistent performance, and pro techniques for attempting different question types under time pressure.",
      },
      {
        heading: "Impact",
        body: "The webinar left students equipped with tools to approach their examinations with confidence, and reflected AIvolutions' ongoing commitment to supporting academic growth alongside technical learning.",
      },
    ],
    imgUrl: "https://ik.imagekit.io/7lzd57wvb/Aivolutions/WEBINAR%202.jpeg",
    id: "WEB_001",
  },
];
