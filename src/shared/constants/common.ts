export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';

export const FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';

export const VALIDATION_PIPE_OPTIONS = { transform: true, whitelist: true };

export const DEFAULT_TOKEN_DECIMAL = 18;
export const OTP_NUMBER_LENGTH = 6;
export const OTP_EXPIRED_TIME = 1000 * 60 * 5; // 5 mins

export const QUEUE_NAME = {
  DEFAULT: 'queue',
  VERIFIER: 'verifier',
  SOCKET: 'socket',
};

export const QUEUE_JOB = {
  MAIL_OTP: 'mail-otp',
};
export const NUMBER_OF_CONCURRENT_JOBS = 10;
export const MAX_RETRY_COUNT = 5;

export const SOCKET_TYPE = {
};
