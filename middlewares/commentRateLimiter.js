import rateLimit from "express-rate-limit";

// Define a rate limit: 10 requests per minute per IP
const commentRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

export default commentRateLimiter;
