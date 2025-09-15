import { z } from "zod";

export const urlSchema = z.object({
  url: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .transform((val) => val.toLowerCase()),

  shortCode: z
    .string()
    .min(3, { message: "Short code must be at least 3 characters" })
    .max(10, { message: "Short code cannot be greater than 10 characters" })
    .optional()
    .or(z.literal("")), // ✅ allows no shortcode
});
