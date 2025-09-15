import URL from "../models/url.model.js";
import User from "../models/user.model.js";
import { responseMessage } from "../utils/response.js";
import { generateShortCode } from "../utils/shortcode.js";
import { createUrlSchema } from "../validators/url.validator.js";

export const createShortUrl = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.json(responseMessage(false, "User not found"));

    // 2. Validate input
    if (!req.body.shortCode) {
      req.body.shortCode = generateShortCode();
    }
    console.log(req.body);
    const { data, error } = createUrlSchema.safeParse(req.body);
    if (error) {
      return res.json(responseMessage(false, error?.issues?.[0].message));
    }

    let { url, shortCode } = data;

    // 4. Ensure shortCode is unique
    let existingLink = await URL.findOne({ shortCode });
    if (existingLink) {
      return res.json(responseMessage(false, "Shortcode already exists"));
    }
    // while (existingLink) {
    //   shortCode = generateShortCode();
    //   existingLink = await URL.findOne({ shortCode });
    // }

    // 5. Create new short URL
    const newLink = await URL.create({
      originalUrl: url,
      shortCode,
      userId: user._id,
      redirectUrl: `${req.protocol}://${req.get("host")}`,
    });

    // 6. Respond with success
    return res
      .status(201)
      .json(responseMessage(true, "Short URL created successfully", newLink));
  } catch (error) {
    console.error("Error while creating short link:", error);
    return res
      .status(500)
      .json(responseMessage(false, "Server error while creating short URL"));
  }
};

export const updateShortUrl = async (req, res) => {
  try {
    // 1. Check if user exists
    const user = await User.findById(req.user._id);
    if (!user) return res.json(responseMessage(false, "User not found"));

    // 2. Validate request body
    const { data, error } = createUrlSchema.safeParse(req.body);
    if (error) {
      return res.json(responseMessage(false, error?.issues?.[0].message));
    }
    const { url, shortCode } = data;

    const { id } = req.params; // ID of the URL to update
    if (!id) return res.json(responseMessage(false, "Invalid URL ID"));

    // 3. Check if shortCode is already taken by another URL
    const existingLink = await URL.findOne({ shortCode, _id: { $ne: id } });
    if (existingLink) {
      return res.json(responseMessage(false, "Shortcode already exists"));
    }

    // 4. Find and update the URL
    const updatedLink = await URL.findByIdAndUpdate(
      id,
      { originalUrl: url, shortCode },
      { new: true } // return the updated document
    );

    if (!updatedLink) {
      return res.json(responseMessage(false, "URL not found"));
    }

    // 5. Respond with success
    return res.json(
      responseMessage(true, "Short URL updated successfully", updatedLink)
    );
  } catch (error) {
    console.error("Error while updating short URL:", error);
    return res
      .status(500)
      .json(responseMessage(false, "Server error while updating URL"));
  }
};

export const deleteShortUrl = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.json(responseMessage(false, "User not found"));

    // 2. Get URL ID from route parameters
    const { id } = req.params;
    if (!id) return res.json(responseMessage(false, "Invalid URL ID"));

    // 3. Find the URL and ensure it belongs to the user
    const link = await URL.findOne({ _id: id, userId: user._id });
    if (!link) {
      return res.json(
        responseMessage(
          false,
          "URL not found or you do not have permission to delete it"
        )
      );
    }

    // 4. Delete the URL
    await URL.findByIdAndDelete(id);

    // 5. Respond with success
    return res.json(responseMessage(true, "Short URL deleted successfully"));
  } catch (error) {
    console.error("Error while deleting short URL:", error);
    return res
      .status(500)
      .json(responseMessage(false, "Server error while deleting URL"));
  }
};

export const getUserLinks = async (req, res) => {
  try {
    if (!req.user) {
      return res.json(
        responseMessage(
          false,
          "User is not logged in, please login and try again"
        )
      );
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.json(responseMessage(false, "User not found"));

    const links = await URL.find({ userId: user._id }).sort({ createdAt: -1 });

    return res.json(
      responseMessage(true, "User links fetched successfully", links)
    );
  } catch (error) {
    console.error("Error while fetching user links:", error);
    return res
      .status(500)
      .json(responseMessage(false, "Server error while fetching links"));
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;
    if (!shortCode)
      return res.json(responseMessage(false, "Please enter shortcode"));
    const link = await URL.findOne({ shortCode });
    if (!link) return res.json(responseMessage(false, "Url not found"));
    link.clicks += 1;
    await link.save();
    return res.redirect(link.originalUrl);
  } catch (error) {
    console.error("error while redirecting", error);
  }
};

// Get single link by ID
export const getLinkById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.json(responseMessage(false, "Invalid URL ID"));

    const link = await URL.findById(id);
    if (!link) return res.json(responseMessage(false, "URL not found"));

    return res.json(responseMessage(true, "URL fetched successfully", link));
  } catch (error) {
    console.error("Error while fetching link:", error);
    return res
      .status(500)
      .json(responseMessage(false, "Server error while fetching link"));
  }
};
