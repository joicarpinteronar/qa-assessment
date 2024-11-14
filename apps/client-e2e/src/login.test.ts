import { test, expect } from '@playwright/test';

test.describe('Login Tests', () => {
  // URL base de la página de login
  const loginUrl = 'http://localhost:4200/login';  // URL actualizada

  // Datos de prueba (usuario y contraseña)
  const username = 'testuser';
  const password = 'testpassword';

  test('Inicio de sesión exitoso con credenciales válidas', async ({ page }) => {
    // Navegar a la página de login
    await page.goto(loginUrl);

    // Rellenar el campo de username
    await page.fill('input[name="username"]', username);

    // Rellenar el campo de password
    await page.fill('input[name="password"]', password);

    // Hacer clic en el botón de "Sign in"
    await page.click('button[type="submit"]');

    // Esperar que la página se redirija (verifica que el login sea exitoso)
    // Dependiendo de la URL a la que te redirija el login, puedes cambiar esta espera.
    // Supongamos que la página de destino después del login es "/dashboard":
    await expect(page).toHaveURL('http://localhost:4200/dashboard'); // Ajusta la URL según tu redirección

    // Verificar que el nombre de usuario o algún otro indicador esté presente
    // por ejemplo, que aparezca el nombre del usuario en la página principal
    await expect(page.locator('text=testuser')).toBeVisible();
  });

  test('Mostrar mensaje de error con credenciales incorrectas', async ({ page }) => {
    // Navegar a la página de login
    await page.goto(loginUrl);

    // Rellenar el campo de username con un valor incorrecto
    await page.fill('input[name="username"]', 'wronguser');

    // Rellenar el campo de password con un valor incorrecto
    await page.fill('input[name="password"]', 'wrongpassword');

    // Hacer clic en el botón de "Sign in"
    await page.click('button[type="submit"]');

    // Verificar que aparezca el mensaje de error
    // Asegúrate de ajustar el selector para el mensaje de error según tu aplicación
    const errorMessage = page.locator('text=Invalid username or password');  // Cambia según el mensaje de tu app
    await expect(errorMessage).toBeVisible();
  });

  test('Verificar si los campos están vacíos y se muestra un mensaje de error', async ({ page }) => {
    // Navegar a la página de login
    await page.goto(loginUrl);

    // Hacer clic en el botón de "Sign in" sin ingresar datos
    await page.click('button[type="submit"]');

    // Verificar que los mensajes de error para cada campo sean visibles
    const usernameErrorMessage = page.locator('text=Username is required');  // Cambia según el mensaje de error
    const passwordErrorMessage = page.locator('text=Password is required');  // Cambia según el mensaje de error
    await expect(usernameErrorMessage).toBeVisible();
    await expect(passwordErrorMessage).toBeVisible();
  });

  test('Verificar campos con datos inválidos', async ({ page }) => {
    // Navegar a la página de login
    await page.goto(loginUrl);

    // Rellenar el campo de username con un valor vacío (o incorrecto)
    await page.fill('input[name="username"]', 'testuser'); // Usando un nombre de usuario válido

    // Rellenar el campo de password con un valor incorrecto (muy corto, por ejemplo)
    await page.fill('input[name="password"]', 'short');  // Contraseña incorrecta (por ejemplo, demasiado corta)

    // Hacer clic en el botón de "Sign in"
    await page.click('button[type="submit"]');

    // Verificar que el mensaje de error para contraseña incorrecta sea visible
    const passwordErrorMessage = page.locator('text=Password is too short');  // Cambia el texto según tu validación
    await expect(passwordErrorMessage).toBeVisible();
  });
});
