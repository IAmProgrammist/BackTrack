import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form"
import { Card, CardContent, CardTitle } from "shared/ui/Card"
import type { MutateProps } from "./types";
import "./mutate.css"
import { yupResolver } from '@hookform/resolvers/yup';
import { object } from "yup";

export function Mutate<T>({
    mutationFn,
    mutationKey,
    onError,
    onMutate,
    onSettled,
    onSuccess,
    children,
    title,
    yupSchema = object()
}: MutateProps<T>) {
    const formMethods = useForm({
        resolver: yupResolver(yupSchema)
    });
    
    const {mutate} = useMutation({
        mutationFn,
        mutationKey,
        onError,
        onMutate,
        onSettled,
        onSuccess
    })

    return <FormProvider {...formMethods}>
        <Card className="mutate">
            {title && <CardTitle className="mutate-title">
                {title}
            </CardTitle>}
            <CardContent className="mutate-content">
                <form onSubmit={formMethods.handleSubmit((data) => mutate(data))}>
                    {children}
                </form>
            </CardContent>
        </Card>
    </FormProvider>
}