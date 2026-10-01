try {
  process.loadEnvFile();
} catch {}

function required(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

const jwtSecret = required("JWT_SECRET");
if (jwtSecret.length < 32) {
  console.error("JWT_SECRET must be at least 32 characters long");
  process.exit(1);
}

export const env = {
  isProd: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT) || 5000,
  mongoUri: required("MONGODB_URI"),
  jwtSecret,
  jwtExpiresDays: Number(process.env.JWT_EXPIRES_DAYS) || 7,
  clientUrl: required("CLIENT_URL").replace(/\/$/, ""),
  trustProxy: Number(process.env.TRUST_PROXY ?? 1),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    folder: process.env.CLOUDINARY_FOLDER || "simana-sandesh",
  },
  allowedImageHosts: (process.env.ALLOWED_IMAGE_HOSTS || "res.cloudinary.com,picsum.photos")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean),
};
