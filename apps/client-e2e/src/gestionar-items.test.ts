import { Selector } from 'testcafe';

// Selectores del formulario de login
const usernameField = Selector('input[name="username"]');
const passwordField = Selector('input[name="password"]');
const signInButton = Selector('button[type="submit"]');

// Selectores del formulario de creación del Item
const titleField = Selector('input[name="title"]');
const contentField = Selector('textarea[name="content"]');
const createPostButton = Selector('button').withText('Create Post');
const cancelButton = Selector('button').withText('Cancel');

// Selectores del botón de editar post
const editButton = Selector('button.edit-button');

// Selectores del formulario de edición de post
const updatePostButton = Selector('button').withText('Update Post');

// Selectores del botón de eliminar post
const deleteButton = Selector('button.delete-button');

// Selectores del post
const postTitle = Selector('h3').withText('Post Title JZFZnTPE');
const postAuthor = Selector('span').withText('testuser');
const postFavoriteBook = Selector('span').withText('Hänsel und Gretel by Brothers Grimm');
const postCreationDate = Selector('div').withText('Created on 14/11/2024');
const postUpdateDate = Selector('div').withText('Updated on 14/11/2024');

// Datos de prueba para login
const validUsername = 'testuser';
const validPassword = 'testpassword';

const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

// Generar valores aleatorios
const generateRandomTitle = (): string => `Post Title ${generateRandomString(8)}`;
const generateRandomContent = (): string => `This is a post content with random data: ${generateRandomString(20)}`;


fixture('Gestionar Items')
    .page('http://localhost:4200/login');


test('Validar la creacion exitosa de un item', async t => {
    // Generar título y contenido aleatorio
    const postTitle = generateRandomTitle();
    const postContent = generateRandomContent();

    await t.maximizeWindow();

    // Iniciar sesión
    await t
        .typeText(usernameField, validUsername)
        .typeText(passwordField, validPassword)
        .click(signInButton)
        .expect(Selector('h1').withText('Posts').exists)
        .ok('La página de dashboard se ha cargado correctamente');

    // Crear un post
    await t
        .click(createPostButton)  // Hacer clic en el botón "Create Post"
        .typeText(titleField, postTitle)  // Ingresar título aleatorio
        .typeText(contentField, postContent)  // Ingresar contenido aleatorio
        .click(createPostButton);  // Enviar el formulario

    // Verificar que el post se ha creado (ajustar según la respuesta de la aplicación)
    const createdPostTitle = Selector('h3').withText(postTitle);
    await t
        .expect(createdPostTitle.exists).ok('El post se ha creado correctamente con el título esperado');
});

test('Validar un item con campos vacíos', async t => {
    // Iniciar sesión
    await t
        .typeText(usernameField, validUsername)
        .typeText(passwordField, validPassword)
        .click(signInButton)
        .expect(Selector('h1').withText('Posts').exists)
        .ok('La página de dashboard se ha cargado correctamente');

    // Hacer clic en el botón "Create Post"
    await t
        .click(createPostButton);

    // Verificar que los campos están vacíos
    await t
        .click(createPostButton)  // Enviar el formulario
        .expect(titleField.value).eql('', 'El campo de título está vacío')
        .expect(contentField.value).eql('', 'El campo de contenido está vacío');    
    
});

test('Validar la cancelacion de la creacion de un item', async t => {
    // Iniciar sesión
    await t
        .typeText(usernameField, validUsername)
        .typeText(passwordField, validPassword)
        .click(signInButton)
        .expect(Selector('h1').withText('Posts').exists)
        .ok('La página de dashboard se ha cargado correctamente');

    // Hacer clic en el botón "Create Post"
    await t
        .click(createPostButton);

    // Verificar que el formulario está visible
    await t
        .expect(titleField.exists).ok('El formulario de creación de post está visible');

    // Hacer clic en el botón "Cancel"
    await t
        .click(cancelButton);

    // Verificar que el usuario ha sido redirigido al dashboard
    const dashboardTitle = Selector('h1').withText('Posts');
    await t
        .expect(dashboardTitle.exists).ok('El usuario ha sido redirigido al dashboard');
});

test('Validar la edicion exitosa de un item', async t => {
    // Generar nuevo título y contenido aleatorio para la edición
    const newPostTitle = generateRandomTitle();
    const newPostContent = generateRandomContent();

    // Iniciar sesión
    await t
        .typeText(usernameField, validUsername)
        .typeText(passwordField, validPassword)
        .click(signInButton)
        .expect(Selector('h1').withText('Posts').exists)
        .ok('La página de dashboard se ha cargado correctamente');

    // Editar un post (hacer clic en el botón de editar)
    await t
        .click(editButton)  // Hacer clic en el botón de editar post
        .expect(titleField.exists).ok('El formulario de edición de post está visible')
        .typeText(titleField, newPostTitle, { replace: true })  // Ingresar nuevo título
        .typeText(contentField, newPostContent, { replace: true })  // Ingresar nuevo contenido
        .click(updatePostButton);  // Enviar formulario de actualización

    // Verificar que el post se ha actualizado correctamente
    const updatedPostTitle = Selector('h3').withText(newPostTitle);
    await t
        .expect(updatedPostTitle.exists).ok('El post ha sido actualizado correctamente con el nuevo título');
});

test('Validar la cancelacion de la edicion de un item', async t => {
    // Iniciar sesión
    await t
        .typeText(usernameField, validUsername)
        .typeText(passwordField, validPassword)
        .click(signInButton)
        .expect(Selector('h1').withText('Posts').exists)
        .ok('La página de dashboard se ha cargado correctamente');

    // Editar un post (hacer clic en el botón de editar)
    await t
        .click(editButton)
        .expect(titleField.exists).ok('El formulario de edición de post está visible');

    // Hacer clic en el botón "Cancel"
    await t
        .click(cancelButton);

    // Verificar que el usuario ha sido redirigido al dashboard
    const dashboardTitle = Selector('h1').withText('Posts');
    await t
        .expect(dashboardTitle.exists).ok('El usuario ha sido redirigido al dashboard');
});

test('Validar la eliminacion de un item', async t => {
    // Iniciar sesión
    await t
        .typeText(usernameField, validUsername)
        .typeText(passwordField, validPassword)
        .click(signInButton)
        .expect(Selector('h1').withText('Posts').exists)
        .ok('La página de dashboard se ha cargado correctamente');

    // Crear un post para eliminar
    const postTitle = generateRandomTitle();
    const postContent = generateRandomContent();
    
    await t
        .click(createPostButton)  // Hacer clic en el botón "Create Post"
        .typeText(titleField, postTitle)  // Ingresar título aleatorio
        .typeText(contentField, postContent)  // Ingresar contenido aleatorio
        .click(createPostButton);  // Enviar el formulario

    // Verificar que el post se ha creado correctamente
    const createdPostTitle = Selector('h3').withText(postTitle);
    await t
        .expect(createdPostTitle.exists).ok('El post se ha creado correctamente');

    // Eliminar el post
    await t
        .click(deleteButton)  // Hacer clic en el botón de eliminar
        .expect(Selector('body').innerText).contains('Are you sure?', 'Se muestra el alert de confirmación')
        .setNativeDialogHandler(() => true)  // Aceptar el alert de confirmación
        .click(deleteButton);  // Confirmar la eliminación

    // Verificar que el post ha sido eliminado
    await t
        .expect(createdPostTitle.exists).notOk('El post ha sido eliminado correctamente');
});

test('Validar la consulta exitosa de la informacion de un item', async t => {
    // Iniciar sesión
    await t
        .typeText(usernameField, validUsername) // Ingresar el nombre de usuario
        .typeText(passwordField, validPassword) // Ingresar la contraseña
        .click(signInButton) // Hacer clic en el botón "Sign In"
        .expect(Selector('h1').withText('Posts').exists) // Verificar que se redirige al dashboard
        .ok('La página de dashboard se ha cargado correctamente');

    // Verificar que el post está visible
    await t
        .expect(postTitle.exists).ok('El título del post está visible')
        .expect(postAuthor.exists).ok('El autor del post está visible')
        .expect(postFavoriteBook.exists).ok('El libro favorito del post está visible')
        .expect(postCreationDate.exists).ok('La fecha de creación está visible')
        .expect(postUpdateDate.exists).ok('La fecha de actualización está visible');

    // Verificar que los botones de editar y eliminar están disponibles
    await t
        .expect(editButton.exists).ok('El botón de editar está visible')
        .expect(deleteButton.exists).ok('El botón de eliminar está visible');
});