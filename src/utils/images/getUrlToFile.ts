export const getUrlToFile = (url: string) => {
  return new Promise<File>((res, rej) => {
    fetch(url).then((response) => {
      response.blob().then((data) => {
        res(new File([data], 'test.jpg', { type: 'image/png' }));
      });
    });
  });
};
