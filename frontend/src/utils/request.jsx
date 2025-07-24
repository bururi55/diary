export async function request(url, method, data) {
  try {
    const response = await fetch(`/api${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: method || 'GET',
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
}
