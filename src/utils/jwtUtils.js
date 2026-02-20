import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const generateCouponToken = (cnpj) => {
  const expiresIn = "7d";

  const token = jwt.sign(
    {
      cnpj,
      type: "trial",
      freeTrialDays: 30,
      issuedAt: new Date().toISOString(),
    },
    JWT_SECRET,
    { expiresIn }
  );

  return token;
};

export const verifyCouponToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      valid: true,
      data: decoded,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
};

export const decodeCouponToken = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    return null;
  }
};

export const getCNPJFromCoupon = (token) => {
  const decoded = decodeCouponToken(token);
  return decoded?.cnpj || null;
};

export const isCouponValid = (token) => {
  const result = verifyCouponToken(token);
  return result.valid;
};

export const getCouponExpirationDate = (token) => {
  const decoded = decodeCouponToken(token);
  if (decoded?.exp) {
    return new Date(decoded.exp * 1000);
  }
  return null;
};
