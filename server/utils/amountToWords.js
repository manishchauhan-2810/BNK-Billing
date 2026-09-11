function amountToWords(amountInPaise) {
  if (amountInPaise === 0) return 'Rupees Zero Only';
  
  const amount = Math.floor(amountInPaise / 100);
  if (amount === 0) return 'Zero Rupees Only';

  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function numberToWordsBelowThousand(num) {
    let word = '';
    if (num > 99) {
      word += ones[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    if (num > 0) {
      if (num < 20) {
        word += ones[num];
      } else {
        word += tens[Math.floor(num / 10)];
        if (num % 10 > 0) {
          word += ' ' + ones[num % 10];
        }
      }
    }
    return word.trim();
  }

  let words = '';
  let num = amount;

  if (Math.floor(num / 10000000) > 0) {
    words += numberToWordsBelowThousand(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }
  if (Math.floor(num / 100000) > 0) {
    words += numberToWordsBelowThousand(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }
  if (Math.floor(num / 1000) > 0) {
    words += numberToWordsBelowThousand(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  if (num > 0) {
    words += numberToWordsBelowThousand(num);
  }

  return 'Rupees ' + words.trim() + ' Only';
}

module.exports = amountToWords;
