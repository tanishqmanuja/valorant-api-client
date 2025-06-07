export function getUrlParams(url: string): string[] {
  const argPattern = /:(\w+)/g;

  const args: string[] = [];

  let match;
  while ((match = argPattern.exec(url)) !== null) {
    if (match[1]) {
      args.push(match[1]);
    }
  }

  return args;
}

export function buildUrl(url: string, params: Record<string, unknown>) {
  const requiredParams = getUrlParams(url);

  for (const rp of requiredParams) {
    if (!params.hasOwnProperty(rp)) {
      throw new Error(`Missing param "${rp}" in URL template: ${url}`);
    } else {
      url = url.replace(`:${rp}`, encodeURIComponent(String(params[rp])));
    }
  }

  return url;
}
