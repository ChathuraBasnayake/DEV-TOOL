export function isValidCIDR(cidr: string): boolean {
  const match = cidr.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!match) return false;
  const [_, o1, o2, o3, o4, mask] = match.map(Number);
  return (
    o1 <= 255 &&
    o2 <= 255 &&
    o3 <= 255 &&
    o4 <= 255 &&
    mask >= 0 &&
    mask <= 32
  );
}

export function isValidJSON(jsonStr: string): boolean {
  try {
    JSON.parse(jsonStr);
    return true;
  } catch {
    return false;
  }
}
