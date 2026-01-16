const PLACEHOLDER_REGEX = /\{\{([^}|]+)(\|([^}]+))?\}\}/g;

export function resolvePlaceholders(text, data) {
  return text.replace(PLACEHOLDER_REGEX, (_, rawKey, _pipe, defaultVal) => {
    const key = rawKey.trim();
    const value = data[key] ?? '';
    if (value && value.length > 0) return value;
    if (defaultVal !== undefined) return defaultVal.trim();
    return '';
  });
}
