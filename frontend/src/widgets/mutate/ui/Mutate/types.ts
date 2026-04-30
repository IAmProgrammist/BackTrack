import type { MutationFunction, MutationFunctionContext } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { AnyObject, ObjectSchema } from "yup";

export interface MutateProps<MutationReturnType> {
    mutationFn: MutationFunction<MutationReturnType>,
    children: ReactNode
    yupSchema?: ObjectSchema<AnyObject, any, any, any>
    title?: string
    mutationKey?: readonly string[],
    onError?: (error: Error, variables: unknown, onMutateResult: unknown, context: MutationFunctionContext) => Promise<unknown> | unknown
    onMutate?: (variables: unknown, context: MutationFunctionContext) => unknown
    onSettled?: (data: MutationReturnType | undefined, error: Error | null, variables: unknown, onMutateResult: unknown, context: MutationFunctionContext) => Promise<unknown> | unknown
    onSuccess?: (data: MutationReturnType, variables: unknown, onMutateResult: unknown, context: MutationFunctionContext) => Promise<unknown> | unknown
}