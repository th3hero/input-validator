const moment = require("moment");

async function validateInput(body, rules, setState) {
    const errors = {};
    for (const [key, value] of Object.entries(rules)) {
        const input = body[key] ?? null;
        const rulesArr = value.split("|");

        for (const ruleStr of rulesArr) {
            const [rule, param] = ruleStr.split(":");

            if (errors[key]) continue;

            if (rulesArr.includes("nullable") && input === null) {
                continue;
            }

            switch (rule) {
                case "required":
                    if (input === null || input === "") {
                        errors[key] = `${key} is required`;
                    }
                    break;
                case "not-empty":
                    if (input === "") {
                        errors[key] = `${key} cannot be blank`;
                    }
                    break;
                case "nullable":
                    continue;
                case "min":
                    if (typeof input === "string" && input.length < parseInt(param)) {
                        errors[key] = `${key} must be at least ${param} characters long`;
                    }
                    break;
                case "max":
                    if (typeof input === "string" && input.length > parseInt(param)) {
                        errors[key] = `${key} cannot be more than ${param} characters long`;
                    }
                    break;
                case "digits":
                    if (typeof input === "string" && input.length !== parseInt(param)) {
                        errors[key] = `${key} should be exactly ${param} characters long`;
                    }
                    break;
                case "email":
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (input !== null && typeof input === "string" && !emailRegex.test(input)) {
                        errors[key] = `Invalid email address for ${key}`;
                    }
                    break;
                case "password":
                    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
                    if (input !== null && typeof input === "string" && !passwordRegex.test(input)) {
                        errors[key] = `${key} must be at least 8 characters long, contain letters, numbers, and at least one special character`;
                    }
                    break;
                case "confirm_password":
                    const confirm = body['confirm_password'];
                    if (confirm === null || confirm === "") {
                        errors[key] = `${key} is missing confirm password field`;
                    } else {
                        if (confirm === input) {
                            errors[key] = `${key} is not matching confirm password field`;
                        }
                    }
                    break;
                case "in":
                    const validValues = param.split(",");
                    if (typeof input === "string" && !validValues.includes(input)) {
                        errors[key] = `${key} must be one of the following values: ${validValues.join(", ")}`;
                    }
                    break;
                case "date":
                    const dateFormat = param || "YYYY-MM-DD";
                    if (input !== null && !moment(input, dateFormat, true).isValid()) {
                        errors[key] = `${key} must be a valid date with format ${dateFormat}`;
                    }
                    break;
                case "future":
                    if (input !== null && typeof input === "string" && moment(input).isValid()) {
                        if (!moment(input).isAfter(moment())) {
                            errors[key] = `${key} must be a future date`;
                        }
                    } else {
                        errors[key] = `${key} is not a valid date`;
                    }
                    break;
                case "past":
                    if (input !== null && typeof input === "string" && moment(input).isValid()) {
                        if (!moment(input).isBefore(moment())) {
                            errors[key] = `${key} must be a past date`;
                        }
                    } else {
                        errors[key] = `${key} is not a valid date`;
                    }
                    break;
                case "string":
                    if (input !== null && typeof input !== "string") {
                        errors[key] = `${key} must be a string`;
                    }
                    break;
                case "integer":
                    if (input !== null && !Number.isInteger(input)) {
                        errors[key] = `${key} must be an integer`;
                    }
                    break;
                case "boolean":
                    if (input !== null && typeof input !== "boolean") {
                        errors[key] = `${key} must be a boolean`;
                    }
                    break;
                case "required_if":
                    const [conditionField, conditionValue] = param.split(",");
                    if (
                        body[conditionField] === conditionValue &&
                        (input === null || input === "")
                    ) {
                        errors[key] = `${key} is required when ${conditionField} is ${conditionValue}`;
                    }
                    break;
                default:
                    break;
            }
        }
    }

    setState(() => errors);
    return Object.keys(errors).length <= 0;
}

module.exports = validateInput;