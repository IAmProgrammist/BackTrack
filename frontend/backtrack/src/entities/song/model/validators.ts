import { array, boolean, mixed, number, object, string } from "yup";

export const SONG_NAME_VALIDATOR = string().required().trim().min(1, "Имя песни не может быть пустым").max(1024, "Имя песни слишком длинное")
export const SONG_TAG_VALIDATOR = string().required().trim().min(0).max(256, "Имя тэга слишком длинное")
export const SONG_DESCRIPTION_VALIDATOR = string().trim().min(0).max(8192, "Описание слишком длинное")
export const SONG_BPM_VALIDATOR = number().optional().min(0)
export const SONG_KEY_VALIDATOR = string().optional().min(1).max(32, "Слишком длиное")
export const SONG_LYRICS_VALIDATOR = string().min(0).max(8192, "Слишком длинное");
export const SONG_FILES_VALIDATOR = array().of(object<{file: File, leading: boolean}>().shape({
    file: array()
        .of(
            mixed<File>()
            .required()
            .test('is-file', "Должен быть валидным файлом", (value) => value instanceof File)
        )
        .min(1)
        .max(1, "Можно выбрать только один файл"),
    leading: boolean().optional()
})).test("check-if-only-of-type-leading", "Ведущим может быть только один файл одного и того же типа", (data) => {
    let mimeTypes: {[key in string]: boolean} = {};
    for (const file of data || []) {
        if (file.leading && file?.file?.[0]?.type) {
            if (mimeTypes[file?.file?.[0]?.type]) {
                return false;
            }

            mimeTypes[file?.file?.[0]?.type] = true;
        }
    }

    return true;
});
export const SONG_AUTHORS_VALIDATOR = array().of(string())
export const SONG_GROUPS_VALIDATOR = array().of(string())