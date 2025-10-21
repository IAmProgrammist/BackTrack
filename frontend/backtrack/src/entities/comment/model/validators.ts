import { string } from "yup";

export const COMMENT_CONTENT_VALIDATOR = string().required().trim().min(1, "Комментарий не может быть пустым").max(8192, "Комментарий слишком длинный")