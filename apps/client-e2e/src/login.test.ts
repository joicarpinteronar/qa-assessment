import { Selector } from 'testcafe';

fixture('Validar la Autenticacion')
    .page('http://localhost:4200/login'); 

// Selectores del formulario
const usernameField = Selector('input[name="username"]');
const passwordField = Selector('input[name="password"]');
const signInButton = Selector('button[type="submit"]');
const errorMessage = Selector('div.text-sm').withText('Invalid credentials');

// Datos de prueba
const validUsername = 'testuser';
const validPassword = 'testpassword';

test('Validar la autenticacion exitosa con credenciales validas', async t => {
    await t
        .typeText(usernameField, validUsername)  // Escribir en el campo de usuario
        .typeText(passwordField, validPassword)  // Escribir en el campo de contraseña
        .click(signInButton)  // Hacer click en el botón de inicio de sesión        
        .expect(Selector('h1').withText('Posts').visible)
        .ok('El home es visible', { timeout: 5000 });  
        
});

test('Validar la autenticacion con un usuario no valido', async t => {
    const invalidUsername = 'wronguser';

    await t
        .typeText(usernameField, invalidUsername)
        .typeText(passwordField, validPassword)
        .click(signInButton)
        .expect(errorMessage.innerText).contains('Invalid credentials');
        
});

test('Validar la autenticacion con una contraseña invalida', async t => {
    const invalidPassword = 'wrongpassword';

    await t
        .typeText(usernameField, validUsername)
        .typeText(passwordField, invalidPassword)
        .click(signInButton)
        .expect(errorMessage.innerText).contains('Invalid credentials');       
        
});