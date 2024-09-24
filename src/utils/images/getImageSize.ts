export const getLoadedImage = (src: string) => {
  return new Promise<HTMLImageElement>((res, rej) => {
    const image = new Image();
    image.onload = (ev) => {
      res(image);
    };
    image.src = src;
  });
};
