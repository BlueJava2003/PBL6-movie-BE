import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export function formatToVietnamDay(date: string | Date): string {
  const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
  const dateObject = typeof date === 'string' ? parseISO(date) : date;
  const vietnamDate = toZonedTime(dateObject, vietnamTimeZone);
  let day = format(vietnamDate, 'dd/MM/yyyy');
  return day;
}

export function formatToVietnamTime(date: string | Date): string {
  const vietnamTimeZone = 'Asia/Ho_Chi_Minh';
  const dateObject = typeof date === 'string' ? parseISO(date) : date;
  const vietnamDate = toZonedTime(dateObject, vietnamTimeZone);
  let time = format(vietnamDate, 'HH:mm');
  return time;
}
