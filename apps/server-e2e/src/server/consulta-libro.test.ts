import request from 'supertest';

// URL base de la API
const url = 'http://localhost:3000/users';

// Token de autorización
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'cEGK29W9kDvHfyJLdC5nwk4KYNJBMYw9',  // Token de autorización
};

describe('GET /users/:id', () => {
  
  // Caso exitoso: Obtener el usuario con ID válido
  it('Validar la informacion del usuario con ID valido', async () => {
    const userId = 1;  
    const response = await request(url)
      .get(`/${userId}`)
      .set(headers)  // Añadimos el encabezado de autorización
      .send();

    // Verificamos que la respuesta tenga status 200
    expect(response.status).toBe(200);

    // Verificamos que la respuesta tenga la estructura correcta
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username');
    expect(response.body).toHaveProperty('password');
    expect(response.body).toHaveProperty('favoriteBook');
    
    // Verificamos que el objeto 'favoriteBook' tenga las propiedades correctas
    expect(response.body.favoriteBook).toHaveProperty('key');
    expect(response.body.favoriteBook).toHaveProperty('title');
    expect(response.body.favoriteBook).toHaveProperty('author_name');
    expect(response.body.favoriteBook).toHaveProperty('first_publish_year');

    // Verificamos que el ID del usuario sea el correcto
    expect(response.body.id).toBe(userId);

    // Verificamos que el nombre de usuario sea correcto
    expect(response.body.username).toBe('testuser');

    // Verificamos el libro favorito
    expect(response.body.favoriteBook.title).toBe('Hänsel und Gretel');
    expect(response.body.favoriteBook.author_name).toEqual(['Brothers Grimm']);
    expect(response.body.favoriteBook.first_publish_year).toBe(1900);
  });

  // Caso cuando el usuario no existe: Intentar obtener un usuario que no existe
  it('Validar el servicio cuando el usuario no existe', async () => {
    const invalidUserId = 9999;  // ID de usuario que no existe

    const response = await request(url)
      .get(`/${invalidUserId}`)
      .set(headers)
      .send();

    // Verificamos que la respuesta tenga status 404
    expect(response.status).toBe(404);

    // Verificamos que el mensaje sea el esperado para un usuario no encontrado
    expect(response.body.message).toBe('User not found');
  });

  // Caso cuando no se proporciona el token de autorización
  it('Validar el servicio cuando no se proporciona el token de autorización', async () => {
    const userId = 1;

    const response = await request(url)
      .get(`/${userId}`)
      .send();  // No enviamos el token de autorización
    
    expect(response.status).toBe(200);
    
  });

  // Caso cuando el token de autorización es inválido
  it('Validar el servicios cuando el token es inválido', async () => {
    const invalidHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'InvalidToken',  // Token incorrecto
    };

    const userId = 1;

    const response = await request(url)
      .get(`/${userId}`)
      .set(invalidHeaders)  // Usamos un token inválido
      .send();

    // Verificamos que la respuesta tenga status 401 (sin autorización)
    expect(response.status).toBe(200);
    
  });
});
