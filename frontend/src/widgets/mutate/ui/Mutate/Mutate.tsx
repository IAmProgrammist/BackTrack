import { useMutation, type MutationFunctionContext } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form"
import { Card, CardContent, CardTitle } from "shared/ui/Card"
import type { MutateProps } from "./types";
import "./mutate.css"
import { yupResolver } from '@hookform/resolvers/yup';
import { object } from "yup";
import { useSnackbar } from "notistack";

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
    const snackbarMethods = useSnackbar();
    
    const {mutate} = useMutation({
        mutationFn,
        mutationKey,
        onError: (error: Error, variables: unknown, onMutateResult: unknown, context: MutationFunctionContext) => {
            console.log(error);
            if (onError) {
                onError(error, variables, onMutateResult, context);
            } else {
                snackbarMethods.enqueueSnackbar({
                    variant: "error",
                    message: (error as {response?: {data?: {context?: {reason?: string}}}})?.response?.data?.context?.reason || error.message
                })
            }
        },
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