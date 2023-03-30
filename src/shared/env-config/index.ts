import * as Joi from 'joi';
export const envSchema = Joi.object({
  MONGO_URI: Joi.string().required(),
  PORT: Joi.number().required(),
  ENV: Joi.string().required(),
  JWT_SECRET_KEY: Joi.string().required(),
  JWT_EXPIRATION_TIME: Joi.string().required(),
  // ORIGIN_ALLOW: Joi.string().required(),
  // INFURA: Joi.string().required(),
  // Prifix_DB_TABLE: Joi.string().required(),
  // Sentry_DSN: Joi.string().required(),
  // Throttler_TTL: Joi.string().required(),
  // Throttler_Limit: Joi.string().required(),
  // CustomStrategy: Joi.string().required(),
  // HalfnHalfStrategy: Joi.string().required(),
  // Escrow: Joi.string().required(),
  // MailboxMoneyStrategy: Joi.string().required(),
  // PassivePulseStrategy: Joi.string().required(),
  // PulseStackerStrategy: Joi.string().required(),
  // AWS_ACCESS_KEY: Joi.string().required(),
  // AWS_KEY_SECRET: Joi.string().required(),
  // AWS_SECRET_NAME: Joi.string().required(),
  // AWS_REGION: Joi.string().required(),
  // Sync_Asset_Log: Joi.string().required(),
  // Automation_Cron_Time: Joi.string().required(),
});