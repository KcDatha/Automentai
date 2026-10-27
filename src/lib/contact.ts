export interface ContactValues {
  name: string;
  email: string;
  company: string;
  message: string;
  /** Honeypot. Real visitors never see or fill this field. */
  website: string;
}

export type ContactField = 'name' | 'email' | 'message';
export type ContactErrors = Partial<Record<ContactField, string>>;

export const CONTACT_LIMITS = { name: 100, email: 120, company: 120, message: 4000 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (values.name.trim().length < 2) errors.name = 'Enter your name';
  const email = values.email.trim();
  if (email === '') errors.email = 'Enter your work email';
  else if (!EMAIL_RE.test(email))
    errors.email = 'Enter a valid email address, like name@company.com';
  if (values.message.trim().length < 10) {
    errors.message =
      'Tell us a little about what you would like to automate (10 characters or more)';
  }
  return errors;
}

export interface SubmitOptions {
  endpoint: string;
  /** Optional. Some form services (Web3Forms) need a public access key in the request. */
  accessKey?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}

export type SubmitResult =
  { ok: true } | { ok: false; reason: 'network' | 'timeout' | 'server'; status?: number };

export async function submitContact(
  values: ContactValues,
  { endpoint, accessKey, fetchImpl = fetch, timeoutMs = 15000 }: SubmitOptions,
): Promise<SubmitResult> {
  // A filled honeypot means a bot. Report success and send nothing.
  if (values.website.trim() !== '') return { ok: true };

  const payload: Record<string, string> = {
    name: values.name.trim().slice(0, CONTACT_LIMITS.name),
    email: values.email.trim().slice(0, CONTACT_LIMITS.email),
    company: values.company.trim().slice(0, CONTACT_LIMITS.company),
    message: values.message.trim().slice(0, CONTACT_LIMITS.message),
  };
  if (accessKey) payload.access_key = accessKey;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (res.ok) return { ok: true };
    return { ok: false, reason: 'server', status: res.status };
  } catch (e) {
    const aborted = e instanceof DOMException && e.name === 'AbortError';
    return { ok: false, reason: aborted ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}
