export const getBase64 = (file: File) => {
  return new Promise<string>((res, rej) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      res(reader.result as string);
    };
    reader.onerror = function (error) {
      rej();
    };
  });
};

export const getImageSize = (url: string) => {
  return new Promise<{ width: number; height: number; url: string }>(
    (res, rej) => {
      const i = new Image();
      i.onload = () => {
        res({ width: i.width, height: i.height, url });
      };
      i.onerror = () => {
        rej();
      };
      i.src = url;
    }
  );
};

export const resizeImageWithMinimum = (minSize: number) => (url: string) =>
  new Promise<{ url: string; width: number; height: number }>((res, rej) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return rej();
      const scale = Math.max(minSize / image.width, minSize / image.height);
      canvas.width = image.width * scale;
      canvas.height = image.height * scale;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      res({
        url: canvas.toDataURL(),
        width: canvas.width,
        height: canvas.height,
      });
    };
    image.src = url;
  });
