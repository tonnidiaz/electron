import { Form, FormProps } from "@heroui/react";
import { useEffect, useRef } from "react";

const TuForm = ({
    onSubmit,
    ...props
}: FormProps) => {

    const ref = useRef<HTMLFormElement>(null)
    useEffect(()=>{
        _onSubmit();
    }, [onSubmit])
    const _onSubmit = () => {
        if (!ref.current) return;
        ref.current.onsubmit = async (e)=>{
            e.preventDefault();
           await onSubmit?.(e as any)
        }
    };

    return (
        <Form ref={ref} {...props} />
    );
};

export default TuForm;