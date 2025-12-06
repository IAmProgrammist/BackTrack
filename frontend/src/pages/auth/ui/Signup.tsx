import "./styles.css"
import { useRegister } from "features/auth/ui/useAuth";
import { useNavigate } from "react-router"
import { Button } from "shared/ui/Button"
import "./styles.css"
import { Mutate } from "widgets/mutate/ui/Mutate"
import { ControlledTextInput } from "shared/ui/ControlledTextInput/ControlledTextInput"
import { ControlledCheckboxInput } from "shared/ui/ControlledCheckboxInput/ControlledCheckboxInput"
import { useAuthService } from "features/auth/ui/useAuthService"

export const Signup = () => {
    const navigate = useNavigate();
    const signupMutationParams = useRegister();
    const authService = useAuthService();

    return <Mutate {...signupMutationParams} yupSchema={authService.registerSchema()} title="Регистрация" onSuccess={() => navigate("/")}>
        <ControlledTextInput controlProps={{name: "username"}} inputProps={{placeholder: "Имя пользователя", type: "text"}}/>
        <ControlledTextInput controlProps={{name: "email"}} inputProps={{placeholder: "Электронная почта", type: "email"}}/>
        <ControlledTextInput controlProps={{name: "password"}} inputProps={{placeholder: "Пароль", type: "password"}}/>
        <ControlledTextInput controlProps={{name: "confirm"}} inputProps={{placeholder: "Подтверждение пароля", type: "password"}}/>
        <ControlledCheckboxInput inputProps={{subText: "Запомнить меня"}} controlProps={{name: "remember"}}/>
        <div className="sign-actions">
            <Button type="submit">Зарегистрироваться</Button>
            <Button type="button" onClick={() => navigate("/sign/signin")}>Войти</Button>
        </div>
    </Mutate>
}