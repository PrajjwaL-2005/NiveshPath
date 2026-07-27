// Express 5 defines req.query as a getter with no setter, so it can't be
// reassigned directly — redefine the property instead (it's configurable).
const setRequestSource = (req, source, value) => {
  if (source === "query") {
    Object.defineProperty(req, "query", {
      value,
      writable: true,
      configurable: true,
      enumerable: true,
    });
  } else {
    req[source] = value;
  }
};

export const validate = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".") || source}: ${issue.message}`)
      .join("; ");
    return res.status(400).json({ message });
  }

  setRequestSource(req, source, result.data);
  next();
};
