// All money is stored and computed in integer paise (1 rupee = 100 paise)
// to avoid floating-point drift. Convert at the API boundary only.
export const toPaise = (rupees) => Math.round(Number(rupees) * 100);
export const toRupees = (paise) => paise / 100;

export const isIntegerPaise = {
  validator: Number.isInteger,
  message: "{PATH} must be an integer number of paise",
};
