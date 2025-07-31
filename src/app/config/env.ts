import dotenv from "dotenv";

dotenv.config();

interface EnvVariables {
  PORT: string;
  MONGO_URI: string;
  NODE_ENV: "development" | "production";
  BCRYPT_SALT_ROUNDS: string;
  ADMIN: {
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
    SUPER_ADMIN_PIN: string;
    SUPER_ADMIN_ADDRESS: string;
  };

  ACCESS_TOKEN_JWT_SECRET: string;
  ACCESS_TOKEN_JWT_EXPIRATION: string;
  REFRESH_TOKEN_JWT_SECRET: string;
  REFRESH_TOKEN_JWT_EXPIRATION: string;
  EXPRESS_SESSION_SECRET: string;
  FRONTEND_URL: string;
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
  EMAIL_SENDER: {
    SMTP_PASS: string;
    SMTP_USER: string;
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_FROM: string;
  };
  REDIS: {
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
  };
}

const loadEnvVariable = (): EnvVariables => {
  const requiredEnvVariables = [
    "PORT",
    "MONGO_URI",
    "NODE_ENV",
    "BCRYPT_SALT_ROUNDS",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "ACCESS_TOKEN_JWT_SECRET",
    "ACCESS_TOKEN_JWT_EXPIRATION",
    "REFRESH_TOKEN_JWT_SECRET",
    "REFRESH_TOKEN_JWT_EXPIRATION",
    "EXPRESS_SESSION_SECRET",
    "FRONTEND_URL",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SMTP_PASS",
    "SMTP_USER",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_FROM",
    "REDIS_HOST",
    "REDIS_PORT",
    "REDIS_USERNAME",
    "REDIS_PASSWORD",
    "SUPER_ADMIN_PIN",
    "SUPER_ADMIN_ADDRESS",
  ];

  requiredEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  });

  return {
    PORT: process.env.PORT as string,
    MONGO_URI: process.env.MONGO_URI as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
    ADMIN: {
      SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
      SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
      SUPER_ADMIN_PIN: process.env.SUPER_ADMIN_PIN as string,
      SUPER_ADMIN_ADDRESS: process.env.SUPER_ADMIN_ADDRESS as string,
    },
    ACCESS_TOKEN_JWT_SECRET: process.env.ACCESS_TOKEN_JWT_SECRET as string,
    ACCESS_TOKEN_JWT_EXPIRATION: process.env.ACCESS_TOKEN_JWT_EXPIRATION as string,
    REFRESH_TOKEN_JWT_SECRET: process.env.REFRESH_TOKEN_JWT_SECRET as string,
    REFRESH_TOKEN_JWT_EXPIRATION: process.env.REFRESH_TOKEN_JWT_EXPIRATION as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    },
    EMAIL_SENDER: {
      SMTP_PASS: process.env.SMTP_PASS as string,
      SMTP_USER: process.env.SMTP_USER as string,
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_PORT: process.env.SMTP_PORT as string,
      SMTP_FROM: process.env.SMTP_FROM as string,
    },
    REDIS: {
      REDIS_HOST: process.env.REDIS_HOST as string,
      REDIS_PORT: process.env.REDIS_PORT as string,
      REDIS_USERNAME: process.env.REDIS_USERNAME as string,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    },
  };
};

const envVariables = loadEnvVariable();
export default envVariables;
