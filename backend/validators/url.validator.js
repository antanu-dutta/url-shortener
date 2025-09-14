import { z } from "zod";

export const createUrlSchema = z.object({
  url: z.string().nonempty("URL is required").url("Please enter a valid URL"),
  shortCode: z
    .string()
    .min(3, { message: "shortcode should be at least of 3 character" })
    .max(10, { message: "shortcode can not be greater than 10 characters" }),
});
