export interface TypedFormData<T extends Record<string, string | File>> extends FormData {
  get<K extends keyof T>(key: Extract<K, string>): T[K];
}