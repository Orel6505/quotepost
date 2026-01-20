import { domToBlob } from 'https://unpkg.com/modern-screenshot@4.6.7/dist/index.mjs';

const quoteImage = document.getElementById('quote-image');
const quoteWrapper = document.getElementById('quote-wrapper');
const bgSquareLayer = document.getElementById('bg-square-layer');
const previewContainer = document.getElementById('quote-preview');
const layoutOptions = document.querySelectorAll('.layout-option');
const downloadBtn = document.getElementById('download-btn');

const titleDisplay = document.getElementById('title-display');
const authorDisplay = document.getElementById('author-display');
const textDisplay = document.getElementById('text-display');
const quoteImg = document.getElementById('quote-img');
const fileInput = document.getElementById('file-input');
const customColorInput = document.getElementById('custom-color-input');
const customColorBox = document.getElementById('custom-color');

const lightTextToggle = document.getElementById('light-text-toggle');
const bgSquareToggle = document.getElementById('bg-square-toggle');
const themeToggle = document.getElementById('theme-toggle');
const hidePhotoToggle = document.getElementById('hide-photo-toggle');

let currentColor = '#8fc00c';
let currentLayout = 'layout-1';
let uploadedImage = null;

// Initialize
const updateQuoteImage = () => {
    quoteImage.style.setProperty('--quote-bg-color', currentColor);
    bgSquareLayer.style.backgroundColor = currentColor;
};

// File upload
quoteImg.addEventListener('click', () => {
    fileInput.click();
});


fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            uploadedImage = event.target.result;
            quoteImg.src = uploadedImage;
        };
        reader.readAsDataURL(file);
    }
});

// Layout selection
layoutOptions.forEach(option => {
    option.addEventListener('click', () => {
        layoutOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        // Remove all layout classes
        quoteImage.className = 'quote-image';
        if (lightTextToggle.classList.contains('active')) {
            quoteImage.classList.add('light-text');
        }

        // Add selected layout
        currentLayout = option.dataset.layout;
        quoteImage.classList.add(currentLayout);
    });
});

// Color selection
document.querySelectorAll('.color-box').forEach(box => {
    box.addEventListener('click', () => {
        document.querySelectorAll('.color-box').forEach(b => b.classList.remove('selected'));
        box.classList.add('selected');
        if (box.dataset.color) {
            currentColor = box.dataset.color;
            customColorInput.value = currentColor;
        }
        updateQuoteImage();
    });
});

customColorInput.addEventListener('input', () => {
    document.querySelectorAll('.color-box').forEach(b => b.classList.remove('selected'));
    customColorBox.classList.add('selected');
    currentColor = customColorInput.value;
    updateQuoteImage();
});

// Light text toggle
lightTextToggle.addEventListener('click', () => {
    lightTextToggle.classList.toggle('active');
    quoteImage.classList.toggle('light-text');
});

// Background square toggle
bgSquareToggle.addEventListener('click', () => {
    bgSquareToggle.classList.toggle('active');
    quoteWrapper.classList.toggle('bg-square');
});

// Hide photo toggle
hidePhotoToggle.addEventListener('click', () => {
    hidePhotoToggle.classList.toggle('active');
    quoteImage.classList.toggle('no-photo');
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Download
downloadBtn.addEventListener('click', async () => {
    // Capture the wrapper if bg-square is active, otherwise just the quote image
    const elementToCapture = quoteWrapper.classList.contains('bg-square') ? quoteWrapper : quoteImage;
    
    const blob = await domToBlob(elementToCapture, {
        scale: 4
    });

    saveAs(blob, 'quote-image.png');
});

// Paste as plain text in contenteditable
document.querySelectorAll('[contenteditable]').forEach(field => {
    field.addEventListener('paste', (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        const selection = globalThis.getSelection();
        if (selection.rangeCount > 0) {
            selection.deleteContents();
            selection.getRangeAt(0).insertNode(document.createTextNode(text));
        }
    });
});

updateQuoteImage();