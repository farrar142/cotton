import { useSnackbar } from 'notistack';

export const useNoti = () => {
  const snackbar = useSnackbar();
  const req = <T extends any>(
    func: Promise<T>,
    { success }: { success: string }
  ) => {
    const snack = snackbar.enqueueSnackbar(success);
    return Promise.all([func]).then(([result]) => {
      snackbar.closeSnackbar(snack);
      return result;
    });
  };
  return { req };
};
