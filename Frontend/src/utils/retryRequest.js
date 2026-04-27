const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const DEFAULT_RETRY_STATUS_CODES = [408, 425, 429, 500, 502, 503, 504];

const isTimeoutError = (error) => {
  const code = error?.code;
  return code === "ECONNABORTED" || code === "ETIMEDOUT";
};

const isNetworkError = (error) => {
  const message = String(error?.message || "").toLowerCase();
  return !error?.response && (message.includes("network") || message.includes("fetch"));
};

const isTransientError = (error, retryStatusCodes = DEFAULT_RETRY_STATUS_CODES) => {
  const status = error?.response?.status;

  if (retryStatusCodes.includes(status)) {
    return true;
  }

  return isTimeoutError(error) || isNetworkError(error);
};

export const requestWithRetry = async ({
  requestFn,
  maxRetries = 2,
  initialDelayMs = 1000,
  backoffMultiplier = 2,
  maxDelayMs = 4000,
  timeoutMs = 20000,
  retryStatusCodes = DEFAULT_RETRY_STATUS_CODES,
  shouldRetry = isTransientError,
  onRetry,
  fallbackFn,
}) => {
  if (typeof requestFn !== "function") {
    throw new Error("requestFn must be a function");
  }

  let attempt = 0;
  let lastError;

  while (attempt <= maxRetries) {
    try {
      return await requestFn({ timeoutMs, attempt });
    } catch (error) {
      lastError = error;

      const retryable = shouldRetry(error, retryStatusCodes);
      const hasMoreRetries = attempt < maxRetries;

      if (!retryable || !hasMoreRetries) {
        break;
      }

      const delayMs = Math.min(
        initialDelayMs * Math.pow(backoffMultiplier, attempt),
        maxDelayMs
      );

      if (typeof onRetry === "function") {
        onRetry({
          attempt: attempt + 1,
          nextAttempt: attempt + 2,
          delayMs,
          error,
        });
      }

      await sleep(delayMs);
      attempt += 1;
    }
  }

  if (typeof fallbackFn === "function") {
    return fallbackFn(lastError);
  }

  throw lastError;
};

export { isTransientError };