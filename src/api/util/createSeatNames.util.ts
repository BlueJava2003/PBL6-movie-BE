export function generateSeatNames(
  rows: number,
  seatsPerRow: number,
  startChar: string = "A"
): string[] {
  const seatNames: string[] = [];
  const startCharCode = startChar.charCodeAt(0); // Lấy mã ký tự của startChar

  for (let row = 0; row < rows; row++) {
    const rowLetter = String.fromCharCode(startCharCode + row);
    for (let seat = 1; seat <= seatsPerRow; seat++) {
      seatNames.push(`${rowLetter}${seat}`);
    }
  }
  return seatNames;
}
