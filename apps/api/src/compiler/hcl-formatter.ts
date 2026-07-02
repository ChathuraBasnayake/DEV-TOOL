/**
 * Formats a raw HCL string with consistent 2-space indentation,
 * block trimming, and clean spacing between resource declarations.
 */
export function formatHCL(rawHcl: string): string {
  const lines = rawHcl.split('\n');
  let indentLevel = 0;
  const formattedLines: string[] = [];

  for (let line of lines) {
    line = line.trim();

    if (!line) {
      formattedLines.push('');
      continue;
    }

    // Check if the line closes a block or list
    // e.g. starts with }, ], or variations like }, or ]
    const closesBlock = /^[}\]]/.test(line);
    if (closesBlock) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Apply the current indentation level
    const indent = '  '.repeat(indentLevel);
    formattedLines.push(indent + line);

    // Check if the line opens a block or list
    // e.g. ends with { or [
    const opensBlock = /[{[]$/.test(line);
    if (opensBlock) {
      indentLevel++;
    }
  }

  // Join lines, cleanup multiple empty lines, and ensure a single trailing newline
  return (
    formattedLines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  );
}
