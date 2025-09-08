export function formatSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  // Return bytes if less than 1 KB
  if (i === 0) return `${bytes} ${sizes[i]}`;

  // Convert to appropriate unit and round to 2 decimal places
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

export const generateUUID = () => crypto.randomUUID();
