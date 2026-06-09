const registerForm = document.querySelector('.register')
const appContent = document.querySelector('.app-content')

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const degree = document.getElementById('degree').value
    const biography = document.getElementById('biography').value

    try {
        const response = await fetch('https://backend-express-mongodb-f6yh.onrender.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username, email, passsword, degree, biography
            })
        })

        const data = await response.json()
        if (data.username) {
            appContent.innerHTML = `
                <h1>Hola ${data.username}</h1>   
            `
        }

    } catch (error) {
        appContent.innerHTML = `
            Error: ${error.message}
        `
    }
})