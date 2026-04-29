export function UUIDGenerator(length = 30) {
  if (length <= 0) {
    throw new Error("Length must be greater than zero");
  }

  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  
  const randomString = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');

  return randomString;
}