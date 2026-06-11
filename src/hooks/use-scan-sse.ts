import { useEffect, useRef, useState } from 'react';
import { AI_BASE_URL, AI_PATHS } from '@/src/config/urls';
import { getCookieHeader } from '@/src/lib/axios';
import { useAuthStore } from '@/src/store/auth';

export type SSEProgressEvent = {
  percent: number;
  status: string;
  message: string;
};

export type SSEResultEvent = {
  meal_name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  grade: string;
  suggestions: string[];
};

export type SSEState = {
  progress: SSEProgressEvent | null;
  result: SSEResultEvent | null;
  error: string | null;
  isConnected: boolean;
};

/**
 * useScanSSE — connect tới ai_service SSE stream cho một scanId.
 * Dùng XMLHttpRequest thay fetch vì iOS NSURLSession buffer fetch response,
 * còn XHR giao chunk dần qua onreadystatechange (readyState=3).
 */
export function useScanSSE(scanId: string | null): SSEState {
  const [state, setState] = useState<SSEState>({
    progress: null,
    result: null,
    error: null,
    isConnected: false,
  });

  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const processedRef = useRef(0); // bytes already parsed

  useEffect(() => {
    if (!scanId || !AI_BASE_URL) return;

    const url = `${AI_BASE_URL}${AI_PATHS.ANALYZE_SSE}?scan_id=${encodeURIComponent(scanId)}`;

    setState({ progress: null, result: null, error: null, isConnected: true });
    processedRef.current = 0;

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.open('GET', url, true);
    xhr.responseType = 'text';
    xhr.timeout = 60000;
    xhr.setRequestHeader('Accept', 'text/event-stream');
    xhr.setRequestHeader('Cache-Control', 'no-cache');

    const cookieHeader = getCookieHeader();
    const csrfToken = useAuthStore.getState().csrfToken?.trim();
    if (cookieHeader) xhr.setRequestHeader('Cookie', cookieHeader);
    if (csrfToken) xhr.setRequestHeader('X-Csrf-Token', csrfToken);

    let buffer = '';

    function parseBuffer() {
      const blocks = buffer.split('\n\n');
      buffer = blocks.pop() ?? '';

      for (const block of blocks) {
        if (!block.trim()) continue;
        const lines = block.split('\n');
        let eventType = '';
        let dataStr = '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            dataStr = line.slice(6).trim();
          }
        }

        if (!eventType || !dataStr) continue;

        try {
          const data = JSON.parse(dataStr);

          if (eventType === 'progress') {
            setState((s) => ({ ...s, progress: data as SSEProgressEvent }));
          } else if (eventType === 'result') {
            setState((s) => ({ ...s, result: data as SSEResultEvent, isConnected: false }));
            xhr.abort();
            return;
          } else if (eventType === 'error') {
            const msg = (data as { message?: string }).message ?? 'Analysis failed';
            setState((s) => ({ ...s, error: msg, isConnected: false }));
            xhr.abort();
            return;
          }
        } catch {
          // ignore malformed chunk
        }
      }
    }

    xhr.onreadystatechange = () => {
      // readyState 3 = LOADING: new data available progressively
      if (xhr.readyState === 3 || xhr.readyState === 4) {
        const newText = xhr.responseText.slice(processedRef.current);
        processedRef.current = xhr.responseText.length;
        if (newText) {
          buffer += newText;
          parseBuffer();
        }
      }
    };

    xhr.onload = () => {
      setState((s) => ({ ...s, isConnected: false }));
    };

    xhr.onerror = () => {
      setState((s) => ({ ...s, isConnected: false, error: 'Connection to AI service lost' }));
    };

    xhr.ontimeout = () => {
      setState((s) => ({ ...s, isConnected: false, error: 'Analysis timed out. Please try again.' }));
    };

    xhr.send();

    return () => {
      xhr.abort();
      xhrRef.current = null;
    };
  }, [scanId]);

  return state;
}
