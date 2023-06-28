/**
 * @description Get a JSON object from the event/input body.
 *
 * Supports strings, objects, and Base64-encoded payloads.
 */
export function getBody(event: Record<string, any>) {
  if (!event) return {};

  // Handle EventBridge event objects
  if (event.detail) return event.detail;

  // Handle GET requests
  if (event.queryStringParameters) return event.queryStringParameters;

  // Handle Slack webhooks and regular API Gateway objects
  const isBase64Encoded = event.isBase64Encoded;
  if (!isBase64Encoded) return typeof event.body === 'string' ? JSON.parse(event.body) : event.body;

  // For unfortunate reasons, it seems the Slack webhooks are not sent with `Content-Type: application/json` so we need to do the conversion ourselves
  const decodedBody = decode(event.body);
  // The 'payload' part comes on the Slack webhooks; else assume no outer layer, but that it needs cleaning
  const isWebhook = decodedBody.startsWith('payload=');
  return isWebhook ? JSON.parse(decodedBody.split('payload=')[1]) : getCleanedObject(decodedBody);
}

/**
 * @description Decodes a Base64 string to a URI-decoded string.
 */
const decode = (input: string) => decodeURIComponent(Buffer.from(input, 'base64').toString());

/**
 * @description Breaks up a encoded body into a pretty object.
 */
const getCleanedObject = (string: string) => {
  const body: Record<string, any> = {};

  const cleanKeysValues = string.replaceAll('%2F', '/').replaceAll('%3A', ':').split('&');

  cleanKeysValues.forEach((pair: string) => {
    const [key, value] = pair.split('=');
    body[key] = value;
  });

  return body;
};
