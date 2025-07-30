export const METHODS = [
    'GET', 'POST', 'PUT', 'DELETE'
] as const;

export type TMethod = typeof METHODS[number];