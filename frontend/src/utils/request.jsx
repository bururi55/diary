const API_BASE_URL = 'http://localhost:5000/api';

export const request = async (
  url,
  method = 'GET',
  body = null,
  customHeaders = {}
) => {
  const defaultOptions = {
    method: method.toUpperCase(),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body !== null) {
    defaultOptions.body = JSON.stringify(body);
  }

  defaultOptions.headers = { ...defaultOptions.headers, ...customHeaders };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, defaultOptions);

    if (response.status === 401) {
      window.location.href = '/login';
    }

    if (!response.ok) {
      throw await response.json().catch(() => ({ error: 'Unknown error' }));
    }

    return await response.json();
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};
