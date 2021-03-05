const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

export const errorObj = (error: string): { error: typeof error; status: "error" } => {
  return {
    error: error,
    status: "error",
  };
};

export function createDiscriminator(): string {
  const arr: number[] = [];

  for (let i = 0; i < 4; i++) {
    const num = NUMBERS[Math.floor(Math.random() * NUMBERS.length)];

    arr.push(num);
  }

  return `#${arr.join("")}`;
}
