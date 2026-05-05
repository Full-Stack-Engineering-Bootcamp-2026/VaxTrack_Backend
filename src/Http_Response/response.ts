export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
};

export const success = <T>(data: T, message = "OK"): ApiResponse<T> => ({
  success: true,
  message,
  data,
});

export const failure = (message = "Error", error?: any): ApiResponse<null> => ({
  success: false,
  message,
  error,
});
