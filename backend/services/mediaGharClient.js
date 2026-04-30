const DEFAULT_MEDIA_GHAR_URL =
  'https://cloudintellectnagpur--dev7.sandbox.my.salesforce-sites.com/MediaGhar/services/apexrest/MediaGhar'

/**
 * POST JSON body to Salesforce MediaGhar Apex REST (same endpoint for hero + contact flows).
 * @param {Record<string, string>} body — keys depend on Apex (e.g. name, email, phone, product, dob, city, notes2)
 * @returns {Promise<{ parsed: unknown }>}
 */
export async function postToMediaGhar(body) {
  const endpoint =
    process.env.SALESFORCE_MEDIA_GHAR_ENDPOINT?.trim() || DEFAULT_MEDIA_GHAR_URL

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  const bearer = process.env.SALESFORCE_MEDIA_GHAR_BEARER_TOKEN?.trim()
  if (bearer) {
    headers.Authorization = `Bearer ${bearer}`
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  let sfResponse
  try {
    sfResponse = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    clearTimeout(timeout)
    const e = new Error(err.message || 'Network error')
    e.code = 'MEDIAGHAR_NETWORK'
    throw e
  }
  clearTimeout(timeout)

  const rawBody = await sfResponse.text()
  let parsed
  try {
    parsed = rawBody ? JSON.parse(rawBody) : null
  } catch {
    parsed = { raw: rawBody }
  }

  if (!sfResponse.ok) {
    const e = new Error('Salesforce request failed')
    e.code = 'MEDIAGHAR_SF_ERROR'
    e.status = sfResponse.status
    e.parsed = parsed
    e.rawBody = rawBody
    throw e
  }

  return { parsed }
}
