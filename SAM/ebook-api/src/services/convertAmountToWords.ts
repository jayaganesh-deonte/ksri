function numberToWords(num: number): string {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  function convertLessThanThousand(n: number): string {
    if (n < 20) return ones[n];
    if (n < 100)
      return (
        tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
      );
    return (
      ones[Math.floor(n / 100)] +
      " Hundred" +
      (n % 100 !== 0 ? " And " + convertLessThanThousand(n % 100) : "")
    );
  }

  function convertToWords(n: number): string {
    if (n === 0) return "Zero";

    let words = "";
    if (n >= 10000000)
      (words += convertLessThanThousand(Math.floor(n / 10000000)) + " Crore "),
        (n %= 10000000);
    if (n >= 100000)
      (words += convertLessThanThousand(Math.floor(n / 100000)) + " Lakh "),
        (n %= 100000);
    if (n >= 1000)
      (words += convertLessThanThousand(Math.floor(n / 1000)) + " Thousand"),
        (n %= 1000);
    if (n > 0) words += (words ? " And " : "") + convertLessThanThousand(n);

    return words.trim();
  }

  return convertToWords(num);
}

const convertAmountToWords = (amount: number): string => {
  const integerPart = Math.floor(amount);
  const words = numberToWords(integerPart);
  return words + " Rupees";
};

export { convertAmountToWords };
