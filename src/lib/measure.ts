export function markStart(label: string) {
  performance.mark(`${label}-start`);
}

export function markEnd(label: string) {
  performance.mark(`${label}-end`);
}

export function measure(label: string) {
  const measureName = `${label}-measure`;
  performance.measure(measureName, `${label}-start`, `${label}-end`);
  const entry = performance.getEntriesByName(measureName).pop();
  performance.clearMeasures(measureName);
  performance.clearMarks(`${label}-start`);
  performance.clearMarks(`${label}-end`);

  return entry?.duration ?? 0;
}
