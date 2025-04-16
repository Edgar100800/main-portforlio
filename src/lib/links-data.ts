export interface SocialLink {
  href: string;
  text: string;
  icon?: string; // Optional: name of lucide icon or path to SVG
}

export const profile = {
  name: "Edgar Chambilla",
  handle: "@edgarchambillaai",
  avatar: "/profile.webp", // Path to your profile picture in /public
};

export const socialLinks: SocialLink[] = [
  {
    href: "https://instagram.com/edgarchambillaai",
    text: "Instagram",
    icon: "instagram",
  },
  {
    href: "https://www.facebook.com/profile.php?id=61575469225416",
    text: "Facebook",
    icon: "facebook",
  },
  {
    href: "https://www.tiktok.com/@edgarchambillaai",
    text: "TikTok",
    icon: "tiktok",
  },
  // {
  //   href: "https://github.com/tu-usuario",
  //   text: "GitHub",
  //   icon: "github", // Example using lucide-react icon name
  // },
  {
    href: "https://edgarchambilla.com",
    text: "Website",
    icon: "globe",
  },
  {
    href: "https://www.linkedin.com/in/edgarchambilla/",
    text: "LinkedIn",
    icon: "linkedin",
  },
  // {
  //   href: "https://twitter.com/tu-usuario",
  //   text: "Twitter / X",
  //   icon: "twitter",
  // },
  {
    href: "https://www.youtube.com/channel/UCC5p06B3S1fUgUpuTTbexbQ",
    text: "YouTube",
    icon: "youtube",
  },
 
 
];

// You could also add other link sections here if needed
// export const projectLinks: SocialLink[] = [...]; 