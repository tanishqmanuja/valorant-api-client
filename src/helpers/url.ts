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
  const args = getUrlParams(url);

  for (const arg of args) {
    if (!params.hasOwnProperty(arg)) {
      throw new Error(`Missing param "${arg}" in URL template: ${url}`);
    } else {
      url = url.replace(`:${arg}`, encodeURIComponent(String(params[arg])));
    }
  }

  return url;
}
