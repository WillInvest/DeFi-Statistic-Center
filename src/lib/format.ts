export const fmtUsd = (n: number): string =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtNum = (n: number): string => n.toLocaleString('en-US');
