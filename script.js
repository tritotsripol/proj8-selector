const colorPicker = new iro.ColorPicker("#picker", {
    width: 350,
    color: "rgb(0,0,0,1)",
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
const harmonyGrid = document.getElementById("harmonyGrid");
const harmonyTypeSelect = document.getElementById("harmonyType");

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
    hslInput.value = `hsla(${Math.round(hsla.h)}, ${Math.round(hsla.s)}%, ${Math.round(hsla.l)}%, ${hsla.a.toFixed(2)})`;

    preview.style.backgroundColor = color.rgbaString;
    updateHarmony(color);
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

// Update harmony when type changes
harmonyTypeSelect.addEventListener("change", () => {
    updateHarmony(colorPicker.color);
});

// Generate harmony colors
function getHarmonyColors(color) {
    const hsla = color.hsla;
    const h = hsla.h;
    const s = hsla.s;
    const l = hsla.l;
    const a = hsla.a;
    const type = harmonyTypeSelect.value;

    let colors = [];

    switch(type) {
        case 'complementary':
            colors = [
                { h: h, s, l, a, name: 'Primary' },
                { h: (h + 180) % 360, s, l, a, name: 'Complementary' }
            ];
            break;
        case 'triadic':
            colors = [
                { h: h, s, l, a, name: 'Primary' },
                { h: (h + 120) % 360, s, l, a, name: 'Triadic 1' },
                { h: (h + 240) % 360, s, l, a, name: 'Triadic 2' }
            ];
            break;
        case 'analogous':
            colors = [
                { h: (h - 30 + 360) % 360, s, l, a, name: 'Analogous 1' },
                { h: h, s, l, a, name: 'Primary' },
                { h: (h + 30) % 360, s, l, a, name: 'Analogous 2' }
            ];
            break;
        case 'tetradic':
            colors = [
                { h: h, s, l, a, name: 'Primary' },
                { h: (h + 90) % 360, s, l, a, name: 'Tetradic 1' },
                { h: (h + 180) % 360, s, l, a, name: 'Tetradic 2' },
                { h: (h + 270) % 360, s, l, a, name: 'Tetradic 3' }
            ];
            break;
        case 'shades':
            colors = [
                { h, s, l: Math.max(l * 0.3, 5), a, name: 'Shade 1' },
                { h, s, l: Math.max(l * 0.6, 10), a, name: 'Shade 2' },
                { h, s, l, a, name: 'Primary' },
                { h, s, l: Math.min(l + 15, 90), a, name: 'Shade 3' }
            ];
            break;
        case 'tints':
            colors = [
                { h, s: Math.max(s * 0.5, 10), l: Math.min(l + 20, 95), a, name: 'Tint 1' },
                { h, s: Math.max(s * 0.7, 15), l: Math.min(l + 10, 90), a, name: 'Tint 2' },
                { h, s, l, a, name: 'Primary' },
                { h, s: Math.max(s * 0.3, 5), l: Math.min(l + 30, 95), a, name: 'Tint 3' }
            ];
            break;
    }

    return colors;
}

// Update harmony display
function updateHarmony(color) {
    const colors = getHarmonyColors(color);
    harmonyGrid.innerHTML = colors.map(c => {
        const hslaString = `hsla(${c.h}, ${c.s}%, ${c.l}%, ${c.a.toFixed(2)})`;
        
        // แปลง HSLA เป็น RGBA
        const rgb = hslaToRgba(c.h, c.s, c.l, c.a);
        const rgbaString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a.toFixed(2)})`;
        
        return `
            <div><b>${c.name}</b></div>
            <div class="harmony-color-preview" style="background-color: ${hslaString}"></div>
            <div class="harmony-code">
              <div>${hslaString}</div>
              <div>${rgbaString}</div>
            </div>
        `;
    }).join('');
}

function hslaToRgba(h, s, l, a) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const c = l < 0.5 ? 2 * s * l : s * (2 - 2 * l);
    const x = c * (1 - Math.abs(k(0) % 2 - 1));
    let r, g, b;
    if (k(0) < 1) { r = c; g = x; b = 0; }
    else if (k(1) < 1) { r = x; g = c; b = 0; }
    else if (k(2) < 1) { r = 0; g = c; b = x; }
    else if (k(3) < 1) { r = 0; g = x; b = c; }
    else if (k(4) < 1) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    const m = l - c / 2;
    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
        a: a
    };
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  alert('Copied: ' + text);
}

// When user changes from color picker
colorPicker.on("color:change", updateAllFromColor);

// Initial update
updateAllFromColor(colorPicker.color);



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

