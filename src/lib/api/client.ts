export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(
    () => null
  );

  if (!response.ok) {
    const message =
      data &&
      typeof data.error === "string"
        ? data.error
        : `Request failed with HTTP ${response.status}.`;

    throw new Error(message);
  }

  return data as T;
}