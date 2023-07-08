// Function to update the modified image with the applied accessibility adjustments
function updateModifiedImage() {
  // Get the canvas and context
  var modifiedImage = document.getElementById('modified-image');
  var ctx = modifiedImage.getContext('2d');
  
  // Clear the canvas
  ctx.clearRect(0, 0, modifiedImage.width, modifiedImage.height);
  
  // Get the original image element
  var originalImage = document.getElementById('original-image');
  
  // Draw the original image onto the canvas
  ctx.drawImage(originalImage, 0, 0);
  
  // Apply the accessibility adjustments
  var contrast = parseFloat(document.getElementById('contrast-slider').value);
  var brightness = parseFloat(document.getElementById('brightness-slider').value);
  var saturation = parseFloat(document.getElementById('saturation-slider').value);
  var grayscale = document.getElementById('grayscale-checkbox').checked;
  var invert = document.getElementById('invert-checkbox').checked;
  
  // Adjust image data
  var imageData = ctx.getImageData(0, 0, modifiedImage.width, modifiedImage.height);
  var pixels = imageData.data;
  
  for (var i = 0; i < pixels.length; i += 4) {
    // Adjust contrast
    pixels[i] = Math.round((pixels[i] - 128) * contrast + 128);
    pixels[i + 1] = Math.round((pixels[i + 1] - 128) * contrast + 128);
    pixels[i + 2] = Math.round((pixels[i + 2] - 128) * contrast + 128);
    
    // Adjust brightness
    pixels[i] = Math.round(pixels[i] * brightness);
    pixels[i + 1] = Math.round(pixels[i + 1] * brightness);
    pixels[i + 2] = Math.round(pixels[i + 2] * brightness);
    
    // Adjust saturation
    var average = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    pixels[i] = Math.round(average + saturation * (pixels[i] - average));
    pixels[i + 1] = Math.round(average + saturation * (pixels[i + 1] - average));
    pixels[i + 2] = Math.round(average + saturation * (pixels[i + 2] - average));
    
    // Apply grayscale
    if (grayscale) {
      var gray = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
      pixels[i] = gray;
      pixels[i + 1] = gray;
      pixels[i + 2] = gray;
    }
    
    // Apply color inversion
    if (invert) {
      pixels[i] = 255 - pixels[i];
      pixels[i + 1] = 255 - pixels[i + 1];
      pixels[i + 2] = 255 - pixels[i + 2];
    }
  }
  
  // Put the modified image data back to the canvas
  ctx.putImageData(imageData, 0, 0);
  
  // Enable the download button
  var downloadBtn = document.getElementById('download-btn');
  downloadBtn.disabled = false;
}

// Function to handle image upload
function handleImageUpload() {
  var imageInput = document.getElementById('image-input');
  var originalImage = document.getElementById('original-image');
  
  var file = imageInput.files[0];
  var reader = new FileReader();
  
  reader.onload = function(event) {
    originalImage.src = event.target.result;
    originalImage.onload = function() {
      // Reset modified image canvas size
      var modifiedImage = document.getElementById('modified-image');
      modifiedImage.width = originalImage.width;
      modifiedImage.height = originalImage.height;
      
      // Update the modified image
      updateModifiedImage();
    };
  };
  
  reader.readAsDataURL(file);
}

// Function to handle accessibility control changes
function handleControlChange() {
  // Update the modified image
  updateModifiedImage();
}

// Function to handle download button click
function handleDownloadButtonClick() {
  var modifiedImage = document.getElementById('modified-image');
  
  // Create a temporary canvas to hold the modified image
  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = modifiedImage.width;
  tempCanvas.height = modifiedImage.height;
  
  var ctx = tempCanvas.getContext('2d');
  ctx.drawImage(modifiedImage, 0, 0);
  
  // Create a temporary anchor element to trigger the download
  var link = document.createElement('a');
  link.href = tempCanvas.toDataURL();
  link.download = 'modified_image.png';
  link.click();
}

// Attach event listeners
document.getElementById('image-input').addEventListener('change', handleImageUpload);
document.getElementById('contrast-slider').addEventListener('input', handleControlChange);
document.getElementById('brightness-slider').addEventListener('input', handleControlChange);
document.getElementById('saturation-slider').addEventListener('input', handleControlChange);
document.getElementById('grayscale-checkbox').addEventListener('change', handleControlChange);
document.getElementById('invert-checkbox').addEventListener('change', handleControlChange);
document.getElementById('download-btn').addEventListener('click', handleDownloadButtonClick);
