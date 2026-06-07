const existingFields = (data) => {
    const { username, email, password } = data
    return username && email && password
}

const existingArticleFields = (data) => {
    const { title, subtitle, text } = data
    return title && subtitle && text
}

const emailValidator = (email) => {
    return email.endsWith('@gmail.com')
}

const passwordValidator = (password) => {
    const passwordCharacters = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{3,}$/
    return passwordCharacters.test(password)
}

const verifyDataLength = (data) => {
    return data.length >= 3
}

export { existingFields, existingArticleFields, emailValidator, passwordValidator, verifyDataLength }