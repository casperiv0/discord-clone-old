export const errorObj = (error: string): { error: typeof error; status: "error" } => {
  return {
    error: error,
    status: "error",
  };
};
