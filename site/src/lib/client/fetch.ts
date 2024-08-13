type FetchInput = Parameters<typeof fetch>[0];

async function fetchAndExpect2xx(input: FetchInput, init?: RequestInit) {
  const response = await fetch(input, init);
  if (!response.ok)
    throw new Error(`fetch(${input}): unexpected ${response.status}`);
  return response;
}

/**
 * fetch helper to smooth over discrepancies between Astro and static web hosts
 */
export async function fetchApi(url: string) {
  const urlWithSlash = url + (url.endsWith("/") ? "" : "/");
  const urlWithoutSlash = urlWithSlash.slice(0, -1);

  if (import.meta.env.DEV) return fetchAndExpect2xx(urlWithSlash);

  // Double-fetch is a workaround for issue similar to this:
  // https://github.com/withastro/astro/issues/11447#issuecomment-2242978626
  // (trailing slash works locally both dev and built, but 404s on GH Pages)
  try {
    // Prioritize the variation that works when deployed
    return await fetchAndExpect2xx(urlWithoutSlash);
  } catch (error) {
    return await fetchAndExpect2xx(urlWithSlash);
  }
}
