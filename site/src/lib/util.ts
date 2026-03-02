/** Exposes matches of a global regular expression as an iterable. */
export function* regExpMatchGenerator(regExp: RegExp, content: string) {
  let match: RegExpExecArray | null;
  while (match = regExp.exec(content)) yield match;
}
