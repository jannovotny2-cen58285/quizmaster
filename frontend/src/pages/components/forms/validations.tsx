import { createContext, useContext } from 'react'
import { Alert } from '../alert.tsx'

export type ErrorMessages<K extends string> = Record<K, string>

export type Validate<T, K extends string> = (data: T) => Set<K>

export type FormValidationContext<K extends string> = {
    readonly errorMessages?: ErrorMessages<K>
    readonly errors: Set<K>
}

export const FormContext = createContext<FormValidationContext<string> | null>(null)

interface ValidationsProviderProps<K extends string> {
    readonly errorMessages?: ErrorMessages<K>
    readonly errors: Set<K>
    readonly children: React.ReactNode
}

export function ValidationsProvider<K extends string>({
    errorMessages,
    errors,
    children,
}: ValidationsProviderProps<K>) {
    return <FormContext.Provider value={{ errorMessages, errors }}>{children}</FormContext.Provider>
}

export function useValidations<K extends string>(): FormValidationContext<K> {
    const context = useContext(FormContext)
    if (!context) throw new Error('useValidations must be used within ValidationsProvider')
    return context as FormValidationContext<K>
}

export const ErrorMessage = ({ error }: { error: string }) => {
    const { errors, errorMessages } = useValidations<string>()

    const errorMessage = errors.has(error) && errorMessages?.[error || '']

    return (
        errorMessage && (
            <Alert type="error" dataTestId={error}>
                {errorMessage}
            </Alert>
        )
    )
}
