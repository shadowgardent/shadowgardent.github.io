const display = document.getElementById('display');
const operators = ['+', '-', '*', '/'];

function append(char) {
  const current = display.value;
  const lastChar = current.slice(-1);

  // ถ้าเป็น operator และตัวสุดท้ายก็เป็น operator => ไม่ให้เพิ่มซ้ำ
  if (operators.includes(char) && operators.includes(lastChar)) {
    return;
  }

  display.value += char;
}

function clearDisplay() {
  display.value = '';
}

function calculate() {
  try {
    display.value = eval(display.value);
  } catch (e) {
    display.value = 'Error';
  }
}
