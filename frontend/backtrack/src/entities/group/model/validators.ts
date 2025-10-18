import { string, array, mixed, number } from "yup"
import { checkIfFilesAreCorrectType, checkIfFilesAreTooBig } from "../../../shared/model/helpers";

export const GROUP_NAME_VALIDATION = string().required("Имя не может быть пустым").min(1, "Имя не может быть пустым").max(1024, "Имя слишком длинное");
export const GROUP_DESCRIPTION_VALIDATION = string().required("Описание не может быть пустым").min(0).max(1024, "Имя слишком длинное");
export const GROUP_IMAGE_VALIDATION = array()
    .of(
        mixed<File>()
        .required()
        .test('is-file', "Должен быть валидным файлом", (value) => value instanceof File)
    )
    .min(0)
    .max(1, "Можно выбрать только одно изображение")
    .test('check-image-size', "Файл слишком большой, загрузите файл до 10 МБ", checkIfFilesAreTooBig)
    .test('check-image-type', "Некорректный формат, выберите .png или .jpeg", checkIfFilesAreCorrectType)
export const GROUP_PARTICIPANTS_VALIDATION = array().of(string()).min(0)