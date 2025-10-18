import type { Metadata } from "next";

interface PageMetadata {
  title: string;
  description: string;
  keywords?: readonly string[];
  ogImage?: string;
}

export function generatePageMetadata({
  title,
  description,
  keywords,
  ogImage = "/images/vertical.png",
}: PageMetadata): Metadata {
  return {
    title,
    description,
    keywords: keywords ? [...keywords].join(", ") : undefined,
    openGraph: {
      title: `${title} | RIVAL ITS`,
      description,
      images: [ogImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | RIVAL ITS`,
      description,
      images: [ogImage],
    },
  };
}

// Common metadata templates
export const metadataTemplates = {
  home: {
    title: "Home",
    description:
      "Welcome to RIVAL ITS - Indonesia's premier robotic team pushing boundaries in technology and innovation.",
    keywords: [
      "robotics",
      "indonesia",
      "technology",
      "innovation",
      "ITS",
      "engineering",
    ],
  },
  about: {
    title: "About Us",
    description:
      "Learn more about RIVAL ITS - our mission, vision, and the passionate team behind Indonesia's leading robotics innovation.",
    keywords: ["about", "team", "mission", "vision", "robotics", "indonesia"],
  },
  teams: {
    title: "Our Teams",
    description:
      "Meet the talented teams that make up RIVAL ITS - from mechanical design to software development, each team brings unique expertise.",
    keywords: ["teams", "mechanical", "software", "electronics", "engineering"],
  },
  contact: {
    title: "Contact Us",
    description:
      "Get in touch with RIVAL ITS - reach out for collaborations, partnerships, or to learn more about our robotics projects.",
    keywords: ["contact", "collaboration", "partnership", "robotics"],
  },
} as const;
