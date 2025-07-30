import { Button, ButtonProps } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

let ready = false;
const TuButton = ({ isDisabled, isLoading, ...props }: ButtonProps & {}) => {
    const [isSubmiting, setIsSubmiting] = useState(false);

    const ref = useRef<HTMLButtonElement>(null);

    function handleSubmit(this: HTMLButtonElement, ev: SubmitEvent) {
        const onsubmit = this.form.onsubmit;
        if (onsubmit.toString().includes("onsubmit.call(ref.current.form")) {
            return;
        }
        this.form.onsubmit = async (e) => {
            e.preventDefault();
            setIsSubmiting(true);
            try {
                await onsubmit.call(ref.current.form, e as any);
            } catch (_) {
            } finally {
                setIsSubmiting(false);
            }
        };
        console.log(onsubmit);
    }

    useEffect(() => {
        ref.current.addEventListener("click", handleSubmit);
        return () => {
            ref.current.removeEventListener("click", handleSubmit);
        };
    }, []);

    return (
        <Button
            ref={ref}
            isDisabled={isDisabled || isSubmiting}
            isLoading={isDisabled || isSubmiting}
            {...props}
        />
    );
};

export default TuButton;
