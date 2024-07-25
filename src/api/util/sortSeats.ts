export function compareFn(a, b) {
  const aMatch = a.name.match(/([A-Za-z]+)(\d+)/);
  const bMatch = b.name.match(/([A-Za-z]+)(\d+)/);

  if (aMatch && bMatch) {
    const [, aLetter, aNumber] = aMatch;
    const [, bLetter, bNumber] = bMatch;

    if (aLetter !== bLetter) {
      return aLetter.localeCompare(bLetter);
    }

    return parseInt(aNumber) - parseInt(bNumber);
  }

  return a.name.localeCompare(b.name);
}
