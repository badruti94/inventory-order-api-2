import env from "../config/env.js";

export const ok = (data = null, meta) => (meta ? { success: true, data, meta } : { success: true, data });

export const fail = (code, message, requestId, details, isAppError) => ({
    success: false,
    code,
    message,
    requestId,
    ...(isAppError && details ? { details } : {}),
    ...(env.nodeEnv !== 'production' && !isAppError ? { debug: message } : {}),
});