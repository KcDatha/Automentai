import { useSyncExternalStore } from 'react';

/**
 * The contact message lives outside the form component so other parts of the page
 * (the savings calculator) can add to it, and so it survives moving between pages.
 */
let message = '';
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setMessage(value: string) {
  message = value;
  emit();
}

/** Adds text after what the visitor already wrote. The same text is never added twice. */
export function appendToMessage(text: string) {
  if (message.includes(text)) return;
  message = message.trim() ? `${message.trim()}\n\n${text}` : text;
  emit();
}

export function getMessage() {
  return message;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useMessage(): string {
  return useSyncExternalStore(subscribe, getMessage, () => '');
}
