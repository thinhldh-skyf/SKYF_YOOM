import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `https://skyf.vercel.app`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `https://skyf.vercel.app/meeting/upcoming `,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `https://skyf.vercel.app/meeting/previous `,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `https://skyf.vercel.app/personalroom `,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
