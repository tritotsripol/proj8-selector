const colorPicker = new iro.ColorPicker("#picker", {
  width: 350,
  color: "#000000", // Initial color
  layout: [
    { component: iro.ui.Wheel },
    { component: iro.ui.Slider, options: { sliderType: 'value' } },
    { component: iro.ui.Slider, options: { sliderType: 'alpha' } },
  ]
});

const hexInput = document.querySelector("#hexValue");
const rgbInput = document.querySelector("#rgbValue");
const hslInput = document.querySelector("#hslValue");
const preview = document.getElementById("preview");

// Convert RGBA to HEXA
function rgbaToHexa(r, g, b, a) {
  const toHex = x => x.toString(16).padStart(2, '0');
  const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
}

// Update all inputs and preview from color
function updateAllFromColor(color) {
  const rgba = color.rgba;
  const hsla = color.hsla;
  const hex = rgbaToHexa(rgba.r, rgba.g, rgba.b, rgba.a);

  hexInput.value = hex;
  rgbInput.value = `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a.toFixed(2)})`;
  hslInput.value = `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a.toFixed(2)})`;

  preview.style.backgroundColor = color.rgbaString;
}

// Sync from HEX
function fromHex() {
  const hex = hexInput.value.trim();
  if (/^#([0-9A-F]{6})([0-9A-F]{2})?$/i.test(hex)) {
    colorPicker.color.hexString = hex;
    updateAllFromColor(colorPicker.color);
  }
}

// Sync from RGB
function fromRgb() {
  const match = rgbInput.value.match(/rgba?\((\d+), (\d+), (\d+), (\d?\.?\d+)\)/);
  if (match) {
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    const a = parseFloat(match[4]);
    colorPicker.color.rgb = { r, g, b, a };
    updateAllFromColor(colorPicker.color);
  }
}

// Sync from HSL
function fromHsl() {
  const match = hslInput.value.match(/hsla?\((\d+), (\d+)%?, (\d+)%?, (\d?\.?\d+)\)/);
  if (match) {
    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    const l = parseInt(match[3]);
    const a = parseFloat(match[4]);
    colorPicker.color.hsl = { h, s, l, a };
    updateAllFromColor(colorPicker.color);
  }
}

// When user changes inputs
hexInput.addEventListener("change", fromHex);
rgbInput.addEventListener("change", fromRgb);
hslInput.addEventListener("change", fromHsl);
hexInput.addEventListener("blur", fromHex);
rgbInput.addEventListener("blur", fromRgb);
hslInput.addEventListener("blur", fromHsl);

// When user changes from color picker
colorPicker.on("color:change", updateAllFromColor);





function copyToClipboard(id) {
  const inputElement = document.getElementById(id);
  const textToCopy = inputElement.value;

  navigator.clipboard.writeText(textToCopy).then(() => {
    alert('Copied: ' + textToCopy); // Show copied value in alert
  }).catch((err) => {
    console.error('Error copying text: ', err);
  });
}

//main system
function changeLanguage(language) {
  document.querySelectorAll('[data-' + language + ']').forEach(function(element) {
    element.textContent = element.getAttribute('data-' + language);
  });
}

changeLanguage('en');

// theme
const themeToggleButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const prismTheme = document.getElementById('prism-theme');

// ตรวจสอบธีมที่บันทึกไว้
let savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
  document.body.classList.add('light');
  document.body.classList.remove('dark');
  themeIcon.src = 'sun-icon.png'; // ไอคอนพระอาทิตย์ (สว่าง)
} else {
  document.body.classList.add('dark');
  document.body.classList.remove('light');
  themeIcon.src = 'moon-icon.png'; // ไอคอนพระจันทร์ (มืด)
}

// ฟังก์ชันเปลี่ยนธีม
themeToggleButton.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light');
  document.body.classList.toggle('dark', !isLight);

  if (isLight) {
    localStorage.setItem('theme', 'light');
    themeIcon.src = 'sun-icon.png'; 
  } else {
    localStorage.setItem('theme', 'dark');
    themeIcon.src = 'moon-icon.png'; 
  }
});


//gotop
const gotop = document.querySelector('.gotop');
gotop.addEventListener('click',function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});