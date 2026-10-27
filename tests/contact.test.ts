import { describe, expect, it, vi } from 'vitest';
import {
  CONTACT_LIMITS,
  submitContact,
  validateContact,
  type ContactValues,
} from '../src/lib/contact';

const valid: ContactValues = {
  name: 'Dana Whitfield',
  email: 'dana@acme.com',
  company: 'Acme',
  message: 'We process invoices by hand and want to stop.',
  website: '',
};

describe('validateContact', () => {
  it('accepts a complete message', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('does not require a company', () => {
    expect(validateContact({ ...valid, company: '' })).toEqual({});
  });

  it('asks for a name', () => {
    expect(validateContact({ ...valid, name: '' }).name).toBe('Enter your name');
    expect(validateContact({ ...valid, name: ' A ' }).name).toBe('Enter your name');
  });

  it('asks for an email and checks its shape', () => {
    expect(validateContact({ ...valid, email: '' }).email).toBe('Enter your work email');
    for (const bad of ['dana', 'dana@', '@acme.com', 'dana@acme', 'dana acme@x.com', 'a@b.c']) {
      expect(validateContact({ ...valid, email: bad }).email).toContain('valid email');
    }
    expect(validateContact({ ...valid, email: '  dana@acme.co.uk ' }).email).toBeUndefined();
  });

  it('asks for a message of at least 10 characters', () => {
    expect(validateContact({ ...valid, message: '' }).message).toContain('10 characters');
    expect(validateContact({ ...valid, message: 'too short' }).message).toContain('10 characters');
    expect(validateContact({ ...valid, message: '0123456789' }).message).toBeUndefined();
  });

  it('reports every problem at once', () => {
    const errors = validateContact({ ...valid, name: '', email: 'x', message: '' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name']);
  });
});

describe('submitContact', () => {
  const ok = () => Promise.resolve(new Response('{}', { status: 200 }));

  it('posts the details as JSON', async () => {
    const fetchImpl = vi.fn(ok);
    const result = await submitContact(valid, { endpoint: 'https://f.test/x', fetchImpl });
    expect(result).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://f.test/x');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    expect(JSON.parse(init.body as string)).toEqual({
      name: 'Dana Whitfield',
      email: 'dana@acme.com',
      company: 'Acme',
      message: 'We process invoices by hand and want to stop.',
    });
  });

  it('adds the access key only when one is set', async () => {
    const withKey = vi.fn(ok);
    await submitContact(valid, {
      endpoint: 'https://f.test/x',
      accessKey: 'abc123',
      fetchImpl: withKey,
    });
    const body = JSON.parse(
      (withKey.mock.calls[0] as unknown as [string, RequestInit])[1].body as string,
    );
    expect(body.access_key).toBe('abc123');

    const withoutKey = vi.fn(ok);
    await submitContact(valid, { endpoint: 'https://f.test/x', fetchImpl: withoutKey });
    const body2 = JSON.parse(
      (withoutKey.mock.calls[0] as unknown as [string, RequestInit])[1].body as string,
    );
    expect('access_key' in body2).toBe(false);
  });

  it('trims fields and cuts them to their limits', async () => {
    const fetchImpl = vi.fn(ok);
    await submitContact(
      { ...valid, name: `  ${'n'.repeat(300)}  `, message: 'm'.repeat(9000) },
      { endpoint: 'https://f.test/x', fetchImpl },
    );
    const body = JSON.parse(
      (fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].body as string,
    );
    expect(body.name).toHaveLength(CONTACT_LIMITS.name);
    expect(body.message).toHaveLength(CONTACT_LIMITS.message);
  });

  it('reports success without sending anything when the honeypot is filled', async () => {
    const fetchImpl = vi.fn(ok);
    const result = await submitContact(
      { ...valid, website: 'http://spam.example' },
      { endpoint: 'https://f.test/x', fetchImpl },
    );
    expect(result).toEqual({ ok: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('reports a server error with its status', async () => {
    const fetchImpl = vi.fn(() => Promise.resolve(new Response('no', { status: 500 })));
    expect(await submitContact(valid, { endpoint: 'https://f.test/x', fetchImpl })).toEqual({
      ok: false,
      reason: 'server',
      status: 500,
    });
  });

  it('reports a network failure', async () => {
    const fetchImpl = vi.fn(() => Promise.reject(new TypeError('Failed to fetch')));
    expect(await submitContact(valid, { endpoint: 'https://f.test/x', fetchImpl })).toEqual({
      ok: false,
      reason: 'network',
    });
  });

  it('gives up after the timeout', async () => {
    const fetchImpl = vi.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          );
        }),
    );
    const result = await submitContact(valid, {
      endpoint: 'https://f.test/x',
      fetchImpl: fetchImpl as unknown as typeof fetch,
      timeoutMs: 20,
    });
    expect(result).toEqual({ ok: false, reason: 'timeout' });
  });
});
