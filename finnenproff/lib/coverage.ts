export const parsePrefixes=(s:string)=>[...new Set(s.split(/[\s,;]+/).filter(x=>/^\d{1,4}$/.test(x)))];
// Empty prefixes = coverage not specified, so it is never treated as a match.
export const covers=(prefixes:string[]|null|undefined,postal:string)=>!!prefixes?.length&&prefixes.some(p=>postal.startsWith(p));
