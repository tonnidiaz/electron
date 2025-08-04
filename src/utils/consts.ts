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

  export const testTreeItems = [
    {
        label: 'app', children: [
            { label: 'home.tsx' },
            { label: 'about.tsx' },
            { label: 'contact.tsx' },
        ]
    },

    { label: 'index.ts' },
    { label: 'package.json.ts' },
    { label: 'java.c' },
    
    {
        label: 'romponents', children: [
            { label: 'comp-home.tsx' },
            { label: 'comp-about.tsx' },
            { label: 'comp-contact.tsx' },
        ]
    },
]