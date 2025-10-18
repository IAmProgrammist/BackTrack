import type { TypedFormData } from "./typedFormData";

type NestedRecord = { [k: string]: string | File | string[] | File[] | NestedRecord }

const flatObject = (sourceObject: NestedRecord, prefix: string = ""): Record<string, string | File | string[] | File[]> => {
  let result = {};
  
  for (const [key, value] of Object.entries(sourceObject)) {
    if (value instanceof File || value instanceof String || typeof value === "string" || Array.isArray(value)) {
      result = {...result, [key]: value}
    } else {
      result = {...result, [key]: flatObject(value, `${prefix}.`)}
    }
  }

  return result;
}

export function objectToFormData<K extends NestedRecord>(obj: K): FormData {
  const formData = new FormData();
  let flattedData = flatObject(obj);

  for (const [key, value] of Object.entries(flattedData)) {
    if (value instanceof File) {
      formData.append(key, value, value.name);
    } else if (typeof value === "string") {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((val) => {
          if (val instanceof File) {
            formData.append(key, val, val.name);
          } else if (typeof val === "string") {
            formData.append(key, val);
          }
        }
      )
    }
  }

  return formData;
}