import './form.scss'
import { useState } from 'react'
import { preventDefault } from 'helpers.ts'
import { type ErrorMessages, type Validate, ValidationsProvider } from './validations.tsx'

interface FormProps<T, K extends string> {
    readonly id?: string
    readonly children: React.ReactNode
    readonly data?: T
    readonly validate?: Validate<T, K>
    readonly errorMessages?: ErrorMessages<K>
    readonly onSubmit: () => void
}

export function Form<T, K extends string>({ id, children, data, errorMessages, validate, onSubmit }: FormProps<T, K>) {
    const [errors, setErrors] = useState<Set<K>>(new Set())

    const submit = preventDefault(() => {
        if (validate && data) {
            const newErrors = validate(data)
            setErrors(newErrors)
        }
        if (errors.size === 0) onSubmit()
    })

    return (
        <ValidationsProvider errors={errors} errorMessages={errorMessages}>
            <form id={id} onSubmit={submit}>
                {children}
            </form>
        </ValidationsProvider>
    )
}
