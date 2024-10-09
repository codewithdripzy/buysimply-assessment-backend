const validateEmail = (email: string) => {
    const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)
    return emailRegex.test(email);
}

export { validateEmail }