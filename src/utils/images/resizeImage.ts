export const resizeImage = (base64: string, maxSize: number) => {
  var image = new Image();
  var canvas = document.createElement('canvas');
  var resize = function () {
    var width = image.width;
    var height = image.height;
    if (width > height) {
      if (width > maxSize) {
        height *= maxSize / width;
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width *= maxSize / height;
        height = maxSize;
      }
    }
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) throw Error;
    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL('image/png');
  };
  return new Promise<string>(function (ok, no) {
    image.onload = function () {
      return ok(resize());
    };
    image.src = base64;
  });
};
