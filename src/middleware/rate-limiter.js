import ratelimit from '../config/upstash.js';

async function rateLimiter(req, res, next) {
  try {
    // In real word applications, you might want to use a unique identifier such as
    // user ID, IP address, or a combination of both to identify the user.
    const { success } = await ratelimit.limit('my-rate-limit');

    if (!success) {
      return res
        .status(429)
        .json({ message: 'Rate limit exceeded. Please try again later.' });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Rate limiter error:', error);
    next(error); // Pass the error to the next middleware
  }
}

export default rateLimiter;
