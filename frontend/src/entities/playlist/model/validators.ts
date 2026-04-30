import { checkIfFilesAreCorrectType, checkIfFilesAreTooBig } from "shared/model/helpers";
import { array, mixed, object, string } from "yup";

export const PLAYLIST_NAME_VALIDATION = string().required("Имя не может быть пустым").min(1, "Имя не может быть пустым").max(1024, "Имя слишком длинное");
export const PLAYLIST_DESCRIPTION_VALIDATION = string().required("Описание не может быть пустым").min(0).max(1024, "Имя слишком длинное");;
export const PLAYLIST_SONGS_VALIDATION = array().of(
    object().shape({
        id: string().required("Поле обязательно"),
        tag: string().optional()
    })
).min(0).max(8192, "Плейлист слишком большой");
export const PLAYLIST_ICON_VALIDATION = array()
    .of(
        mixed<File>()
        .required()
        .test('is-file', "Должен быть валидным файлом", (value) => value instanceof File)
    )
    .min(0)
    .max(1, "Можно выбрать только одно изображение")
    .test('check-image-size', "Файл слишком большой, загрузите файл до 10 МБ", checkIfFilesAreTooBig)
    .test('check-image-type', "Некорректный формат, выберите .png или .jpeg", checkIfFilesAreCorrectType);