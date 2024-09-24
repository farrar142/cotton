import { client } from './client';

export const Misc = {
  Segmentation: {
    postSegmentation: (image: string) => {
      return client.post<{ images: boolean[][][] }>('/segments/', { image });
    },
  },
};
