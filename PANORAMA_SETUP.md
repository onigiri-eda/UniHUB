# 360-Degree Panorama Viewer Setup

## Overview
The 360-degree panorama viewer has been added to the IITU campus tour section. It allows users to interactively explore panoramic images of campus locations.

## Features
- **Two Locations:**
  - Актовый зал (Aktorovyy Zal)
  - INO центр (INO Centre)

- **Interactive Controls:**
  - **Mouse:** Click and drag to look around
  - **Touch:** Swipe to look around
  - **Zoom:** Scroll mouse wheel to zoom in/out

- **Responsive Design:** Works on desktop, tablet, and mobile devices

## How to Add Your 360 Images

### Step 1: Prepare Your Images
- You need 2 equirectangular 360-degree JPG images
- Recommended size: 4096×2048 pixels or higher for quality
- Image format: JPEG or PNG

### Step 2: Add Images to Project
1. Place your images in the `images/` folder:
   - `aktorovyy-zal-360.jpg` - for Актовый зал
   - `ino-centre-360.jpg` - for INO центр

### Step 3: Update Image Paths (if needed)
If you want to use different filenames, edit `js/panorama-viewer.js` and update the `locations` object:

```javascript
this.locations = {
    'aktorovyy-zal': {
        name: 'Актовый зал',
        image: 'images/your-image-name.jpg'
    },
    'ino-centre': {
        name: 'INO центр',
        image: 'images/your-image-name.jpg'
    }
};
```

## How It Works

### Technology Stack
- **Three.js**: 3D graphics library for rendering the panorama sphere
- **WebGL**: GPU-accelerated rendering for smooth performance
- **Canvas API**: For responsive rendering

### User Interaction Flow
1. User clicks one of the two buttons (Актовый зал or INO центр)
2. The corresponding 360-degree image is loaded
3. A sphere is created inside-out with the image texture mapped to it
4. User can look around by dragging (mouse) or swiping (touch)
5. Mouse wheel allows zooming in and out

## Troubleshooting

### Images Not Showing
- Ensure image paths are correct in `js/panorama-viewer.js`
- Check browser console for CORS (Cross-Origin) errors
- Images must be in the same domain or have proper CORS headers

### Performance Issues
- Reduce image resolution if experiencing lag
- Use JPEG format for smaller file size
- Disable antialiasing in browsers if needed

### Touch Not Working
- Ensure touch events are enabled on mobile devices
- Test on actual devices (browser emulation may not fully support touch)

## File Structure
```
UniHUB/
├── iitu.html                 (Updated with panorama viewer section)
├── js/
│   ├── panorama-viewer.js   (New - Panorama viewer script)
│   ├── main.js
│   ├── chat.js
│   └── universities.js
├── css/
│   └── styles.css           (Updated with panorama styles)
└── images/
    ├── aktorovyy-zal-360.jpg
    └── ino-centre-360.jpg
```

## Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 11+)
- Mobile browsers: ✅ Full support with touch controls

## Additional Customization

### Add More Locations
To add more panoramic locations, edit `js/panorama-viewer.js`:

1. Add new entry to `locations` object:
```javascript
'new-location': {
    name: 'Location Name',
    image: 'images/new-location-360.jpg'
}
```

2. Add button to `iitu.html`:
```html
<button class="btn-panorama" data-location="new-location">Location Name</button>
```

### Customize Button Colors
Edit `css/styles.css` and modify `.btn-panorama`, `.btn-panorama:hover`, and `.btn-panorama.active` classes.

### Change Initial Camera Settings
In `js/panorama-viewer.js`, modify the `init()` method:
```javascript
this.camera = new THREE.PerspectiveCamera(
    75,      // Field of view (in degrees)
    width / height,
    0.1,
    1000
);
```

## Notes
- The panorama viewer uses GPU acceleration, so performance may vary on older devices
- Images are downloaded client-side, so consider file size for bandwidth
- The viewer maintains aspect ratio and responsive design on all screen sizes
