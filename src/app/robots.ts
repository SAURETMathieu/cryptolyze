import { MetadataRoute } from "next";
import { host } from "@/src/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/",
    },
    sitemap: `${host}/sitemap.xml`,
  };
}
