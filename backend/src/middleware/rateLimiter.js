import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // user id or ip address
    const { success } = await ratelimit.limit("my-rate-limit");
    if (!success) {
      return res.status(429).json({ message: "too many requests" });
    } else {
      next();
    }
  } catch (error) {
    console.log("rate limit error", error);
    next(error);
  }
};

export default rateLimiter;
