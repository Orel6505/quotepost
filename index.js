// Try to import screenshot library, but continue if it fails
let domToBlob;
try {
    const module = await import('https://unpkg.com/modern-screenshot@4.6.7/dist/index.mjs');
    domToBlob = module.domToBlob;
} catch (e) {
    console.warn('Screenshot library not available:', e);
}

const quoteImage = document.getElementById('quote-image');
const quoteWrapper = document.getElementById('quote-wrapper');
const bgSquareLayer = document.getElementById('bg-square-layer');
const previewContainer = document.getElementById('quote-preview');
const layoutOptions = document.querySelectorAll('.layout-option');
const downloadBtn = document.getElementById('download-btn');

// Content inputs
const textDisplay = document.getElementById('text-display');
const textDisplayPreview = document.getElementById('text-display-preview');
const titleInput = document.getElementById('title-input');
const titleDisplay = document.getElementById('title-display');
const authorInput = document.getElementById('author-input');
const authorDisplay = document.getElementById('author-display');
const quoteImg = document.getElementById('quote-img');
const fileInput = document.getElementById('file-input');
const uploadImageBtn = document.getElementById('upload-image-btn');
const customColorInput = document.getElementById('custom-color-input');
const customColorBox = document.getElementById('custom-color');

const lightTextToggle = document.getElementById('light-text-toggle');
const bgSquareToggle = document.getElementById('bg-square-toggle');
const themeToggle = document.getElementById('theme-toggle');
const hidePhotoToggle = document.getElementById('hide-photo-toggle');
const fontSelect = document.getElementById('font-select');
const fontSizeSlider = document.getElementById('font-size-slider');
const fontSizeValue = document.getElementById('font-size-value');

// Navigation
const sidebarNavItems = document.querySelectorAll('.sidebar .nav-item');
const mobileNavBtns = document.querySelectorAll('.mobile-nav .nav-btn');
const editorSections = document.querySelectorAll('.editor-section');

let currentColor = '#8fc00c';
let currentLayout = 'layout-1';
let uploadedImage = null;

// Initialize
const updateQuoteImage = () => {
    quoteImage.style.setProperty('--quote-bg-color', currentColor);
    bgSquareLayer.style.backgroundColor = currentColor;
};

// Sync text input to preview
textDisplay.addEventListener('input', () => {
    textDisplayPreview.textContent = textDisplay.value;
});

// Sync title input to preview
titleInput.addEventListener('input', () => {
    titleDisplay.textContent = titleInput.value;
});

// Sync author input to preview
authorInput.addEventListener('input', () => {
    authorDisplay.textContent = authorInput.value;
});

// File upload
uploadImageBtn.addEventListener('click', () => {
    fileInput.click();
});

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

// Navigation handling (Desktop Sidebar)
sidebarNavItems.forEach(item => {
    item.addEventListener('click', () => {
        const section = item.dataset.section;
        
        // Update active state
        sidebarNavItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show corresponding section
        editorSections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === `${section}-section`) {
                sec.classList.add('active');
            }
        });
    });
});

// Navigation handling (Mobile Bottom Nav)
mobileNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        
        // Update active state
        mobileNavBtns.forEach(nav => nav.classList.remove('active'));
        btn.classList.add('active');
        
        // Show corresponding section
        editorSections.forEach(sec => {
            sec.classList.remove('active');
            if (sec.id === `${section}-section`) {
                sec.classList.add('active');
            }
        });
    });
});

// Layout selection
layoutOptions.forEach(option => {
    option.addEventListener('click', () => {
        layoutOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        // Remove all layout classes but preserve state classes
        const hasLightText = quoteImage.classList.contains('light-text');
        const hasNoPhoto = quoteImage.classList.contains('no-photo');
        
        quoteImage.className = 'quote-image';
        if (hasLightText) {
            quoteImage.classList.add('light-text');
        }
        if (hasNoPhoto) {
            quoteImage.classList.add('no-photo');
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

// Font selection
fontSelect.addEventListener('change', () => {
    quoteImage.style.fontFamily = fontSelect.value;
});

// Font size selection
fontSizeSlider.addEventListener('input', () => {
    const size = fontSizeSlider.value;
    fontSizeValue.textContent = size + 'px';
    textDisplayPreview.style.fontSize = size + 'px';
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// Download
downloadBtn.addEventListener('click', async () => {
    if (!domToBlob) {
        alert('Download feature requires external library. Please ensure internet connection.');
        return;
    }
    
    // Capture the wrapper if bg-square is active, otherwise just the quote image
    const elementToCapture = quoteWrapper.classList.contains('bg-square') ? quoteWrapper : quoteImage;
    
    try {
        const blob = await domToBlob(elementToCapture, {
            scale: 4
        });
        saveAs(blob, 'quote-image.png');
    } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again.');
    }
});

updateQuoteImage();