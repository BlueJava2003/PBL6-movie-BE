import { HttpCode, HttpException, HttpStatus } from '@nestjs/common';

export function generateSeatNames(
  rows: number,
  seatsPerRow: number,
  startChar: string = 'A',
): string[] {
  const seatNames: string[] = [];
  const startCharCode = startChar.charCodeAt(0); // Get the character code of startChar
  const endCharCode = startCharCode + rows - 1;

  if (endCharCode > 'Z'.charCodeAt(0)) {
    throw new HttpException(
      'Number of rows exceeds the limit of available characters from the start character.',
      HttpStatus.BAD_REQUEST,
    );
  }

  for (let row = 0; row < rows; row++) {
    const rowLetter = String.fromCharCode(startCharCode + row);
    for (let seat = 1; seat <= seatsPerRow; seat++) {
      seatNames.push(`${rowLetter}${seat}`);
    }
  }

  return seatNames;
}
