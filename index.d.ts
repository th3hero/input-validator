import { Dispatch, SetStateAction } from "react";

export default function validateInput(
    body: Record<string, any>,
    rules: Record<string, string>,
    setState: Dispatch<SetStateAction<Record<string, string>>>
): Promise<boolean>;