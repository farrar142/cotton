export type ImageType = {
  id: number;
  url: string;
  options?: Partial<{
    violent: boolean;
    nudity: boolean;
    sensitive: boolean;
  }>;
};
