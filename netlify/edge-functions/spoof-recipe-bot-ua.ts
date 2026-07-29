type Context = {
  next: (request?: Request) => Promise<Response>;
};

// Real browsers never send this header; clients that do (e.g. Samsung Food's
// grpc-web-ts based importer) aren't recognized by the prerendering
// extension's user-agent allowlist, so they never get prerendered HTML.
// Rewriting their User-Agent to one the extension already recognizes lets
// them ride the existing prerendering pipeline.
const NON_BROWSER_SIGNAL_HEADER = 'x-user-agent';
const RECOGNIZED_BOT_UA = 'facebookexternalhit/1.1';

export default async (request: Request, context: Context) => {
  const matched = request.headers.has(NON_BROWSER_SIGNAL_HEADER);
  if (matched) {
    const headers = new Headers(request.headers);
    headers.set('user-agent', RECOGNIZED_BOT_UA);
    request = new Request(request, { headers });
  }

  const response = await context.next(request);
  response.headers.set('x-debug-edge-ran', 'true');
  response.headers.set('x-debug-edge-matched', String(matched));
  return response;
};

export const config = { path: '/recipe/*' };
