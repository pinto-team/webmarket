/**
 * تبدیل اعداد انگلیسی به فارسی
 */
export function toPersianNumber(input: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const str = String(input);
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}
