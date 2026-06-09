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
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, degree, biography })
        })

        const data = await response.json()

        if (!response.ok) {
            appContent.innerHTML = `<p style="color: red;">Error: ${data.error || 'No se pudo registrar'}</p>`
            return
        }

        appContent.innerHTML = `
            <h1>Registro exitoso</h1>
            <p>Bienvenido, <strong>${data.user.username}</strong></p>
            <p>Correo: ${data.user.email}</p>
            ${data.user.degree ? `<p>Grado: ${data.user.degree}</p>` : ''}
        `

    } catch (error) {
        appContent.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`
    }
})