export type ImageType = {
  id: number;
  url: string;
  small?: string;
  medium?: string;
  large?: string;
  options?: Partial<{
    violent: boolean;
    nudity: boolean;
    sensitive: boolean;
  }>;
};
