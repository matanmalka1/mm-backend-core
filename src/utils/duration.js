const DEFAULT_REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const parseDurationToMs = (value, defaultMs) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value * 1000;
  }

  if (typeof value !== "string") {
    return defaultMs;
  }

  const trimmed = value.trim();
  if (!trimmed) return defaultMs;

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed) * 1000;
  }

  const match = trimmed.match(/^(\d+)(ms|s|m|h|d)$/i);
  if (!match) return defaultMs;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * (multipliers[unit] || 1);
};

export const getRefreshTokenTtlMs = () =>
  parseDurationToMs(process.env.JWT_REFRESH_EXPIRES_IN, DEFAULT_REFRESH_TTL_MS);
