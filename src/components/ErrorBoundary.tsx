import { type ReactNode } from "react";
import { useRouteError } from "react-router-dom";

interface Props {
    children?: ReactNode;
}

export const ErrorBoundary = ({ children }: Props) => {
    const error = useRouteError();

    return (
        <div className="
            min-h-screen
            bg-[#FAFAF8]
            flex
            items-center
            justify-center
            px-6
        ">
            <div className="text-center max-w-md">

                <p className="text-[10px] uppercase tracking-[0.8em] text-black/40">
                    Vril Couture
                </p>

                <h1 className="
                    mt-6
                    font-display
                    text-5xl md:text-7xl
                    uppercase
                    tracking-[-0.04em]
                    font-light
                    text-black
                ">
                    Error
                </h1>

                <div className="mt-8 w-12 h-px bg-black/20 mx-auto" />

                <p className="mt-8 text-sm text-black/50 leading-relaxed">
                    {error instanceof Error
                        ? error.message
                        : "Something unexpected happened."
                    }
                </p>

                <button
                    onClick={() => window.location.href = "/"}
                    className="
                        mt-10
                        text-xs
                        uppercase
                        tracking-[0.5em]
                        border-b
                        border-black
                        pb-2
                        hover:opacity-50
                        transition
                    "
                >
                    Return Home
                </button>

                {children}

            </div>
        </div>
    );
};