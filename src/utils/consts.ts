export const METHODS = ["GET", "POST", "OPTIONS", "DELETE"] as const;
export const typeMap = {
    string: "text",
    number: "number",
    boolean: "checkbox",
    bigint: "number",
    symbol: "text",
    undefined: "text",
    object: "file",
    function: "hidden"
  };