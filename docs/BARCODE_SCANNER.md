# Barcode Scanner Feature

## Overview
The UPC search functionality now includes camera-based barcode scanning using the device's camera.

## Features
- **Camera Integration**: Uses device camera to scan UPC barcodes
- **Auto-detection**: Automatically detects and processes barcode when found
- **Fallback Support**: Manual text input still available
- **Permission Handling**: Gracefully handles camera permission requests
- **Error Handling**: Clear error messages for camera access issues

## Usage

### In Food Entry Page
1. Navigate to `/food_entry`
2. Click the camera button (📷) next to the UPC search field
3. Allow camera permissions when prompted
4. Point camera at a UPC barcode
5. The code will be automatically detected and used for food lookup

### Components
- **BarcodeScanner.jsx**: Core scanner component using @zxing/library
- **FoodForm.jsx**: Updated to include scanner integration

## Technical Details

### Dependencies
- `@zxing/library`: JavaScript barcode scanning library
- Camera API: Uses `navigator.mediaDevices.getUserMedia()`

### Browser Support
- Modern browsers with camera API support
- HTTPS required for camera access in production
- Mobile browsers with camera access

### Camera Permissions
- Requests `video` permission with `facingMode: 'environment'` (back camera)
- Handles permission denial gracefully
- Shows clear error messages for access issues

## Security Considerations
- Camera access requires HTTPS in production
- No video data is stored or transmitted
- Scanner stops immediately after successful scan

## Installation
The feature is automatically available after:
```bash
npm install  # Installs @zxing/library dependency
npm run dev  # Start development server
```

## Troubleshooting

### Camera Not Working
- Ensure HTTPS is enabled (required for camera access)
- Check browser permissions for camera access
- Verify device has a working camera

### Scanner Not Detecting Barcodes
- Ensure good lighting conditions
- Hold barcode steady and at appropriate distance
- Try different angles if initial scan fails
- Fallback to manual UPC entry if needed
