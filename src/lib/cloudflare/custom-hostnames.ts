export async function addCustomHostname(hostname: string) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;

  if (!token || !zoneId) {
    throw new Error('Cloudflare API credentials not configured');
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/custom_hostnames`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        hostname,
        ssl: {
          method: 'http',
          type: 'dv',
        },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    console.error('Failed to add custom hostname', data);
    throw new Error('Failed to add custom hostname to Cloudflare');
  }

  return data;
}

export async function getHostnameStatus(hostname: string) {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const zoneId = process.env.CLOUDFLARE_ZONE_ID;

  if (!token || !zoneId) {
    throw new Error('Cloudflare API credentials not configured');
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/custom_hostnames?hostname=${hostname}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error('Failed to fetch custom hostname status');
  }

  return data;
}
