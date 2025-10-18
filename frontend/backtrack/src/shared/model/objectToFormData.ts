import type { TypedFormData } from "./typedFormData";

export function objectToFormData<K extends Record<string, string | File>>(obj: K): TypedFormData<K> {
  const formData = new FormData() as TypedFormData<K>;

  for (const [key, value] of Object.entries(obj)) {
    if (value instanceof File) {
      formData.append(key, value, value.name);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  }

  return formData;
}