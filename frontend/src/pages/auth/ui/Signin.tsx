import { useNavigate } from "react-router"
import { Button } from "shared/ui/Button"
import "./styles.css"
import { useLogin } from "features/auth/ui/useAuth"
import { Mutate } from "widgets/mutate/ui/Mutate"
import { ControlledTextInput } from "shared/ui/ControlledTextInput/ControlledTextInput"
import { ControlledCheckboxInput } from "shared/ui/ControlledCheckboxInput/ControlledCheckboxInput"
import { useAuthService } from "features/auth/ui/useAuthService"

export const Signin = () => {
    const navigate = useNavigate();
    const signinMutationParams = useLogin();
    const authService = useAuthService();

    return <Mutate {...signinMutationParams} yupSchema={authService.loginSchema()} title="Войти в аккаунт" onSuccess={() => navigate("/")}>
        <ControlledTextInput controlProps={{name: "email"}} inputProps={{placeholder: "Электронная почта", type: "email", autoComplete: "email"}}/>
        <ControlledTextInput controlProps={{name: "password"}} inputProps={{placeholder: "Пароль", type: "password", autoComplete: "current-password"}}/>
        <ControlledCheckboxInput inputProps={{subText: "Запомнить меня"}} controlProps={{name: "remember"}}/>
        <div className="sign-actions">
            <Button type="submit">Войти</Button>
            <Button type="button" onClick={() => navigate("/sign/signup")}>Зарегистрироваться</Button>
        </div>
    </Mutate>
}