import request from 'supertest';

// URL base de la API
const url = 'http://localhost:3000/posts';

// Token de autorización
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'cEGK29W9kDvHfyJLdC5nwk4KYNJBMYw9',  // Token de autorización
};

// Función para generar cadenas alfanuméricas aleatorias
function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

describe('PUT /posts/:id', () => {
  // Caso exitoso: Actualizar un post con datos válidos
  it('Validar la actualizacion exitosa de un item con datos validos', async () => {
    const validPostData = {
        title: generateRandomString(10), // Genera un título aleatorio de 10 caracteres
        content: generateRandomString(20), // Genera un contenido aleatorio de 20 caracteres
    };

    const response = await request(url)
      .put('/8')  // Suponemos que estamos actualizando el post con id 3
      .set(headers)
      .send(validPostData);

    // Comprobamos que la respuesta tenga status 200
    expect(response.status).toBe(200);

    // Verificamos que la respuesta contenga los datos esperados
    expect(response.body).toHaveProperty('id', 8);
    expect(response.body).toHaveProperty('authorId');
    expect(response.body).toHaveProperty('title', validPostData.title);  // Título actualizado
    expect(response.body).toHaveProperty('content', validPostData.content);  // Contenido actualizado
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');

    // Verificamos que el campo 'updatedAt' tiene una nueva fecha
    const originalUpdatedAt = new Date('2024-11-06T03:26:12.254Z').getTime();
    const updatedAt = new Date(response.body.updatedAt).getTime();
    expect(updatedAt).toBeGreaterThan(originalUpdatedAt);
  });

  
  it('Validar el campo titulo cuando se le agregan valores numericos', async () => {
    const invalidPostData = {
      title: 1,  // Title es un número (debe ser string)
      content: "esta es un test",
    };

    const response = await request(url)
      .put('/8')
      .set(headers)
      .send(invalidPostData);

    // Verificamos que el status sea 422 (Unprocessable Entity)
    expect(response.status).toBe(422);

    // Verificamos que la respuesta contenga el error correcto
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toHaveLength(1);

    const error = response.body.errors[0];
    expect(error.code).toBe('invalid_type');
    expect(error.message).toBe('Expected string, received number');
    expect(error.path).toEqual(['title']);
  });

  
  it('Validar cuando el campo content esta vacio', async () => {
    const invalidPostData = {
      title: generateRandomString(10),
      content: "",  // Content vacío (se requiere al menos 1 carácter)
    };

    const response = await request(url)
      .put('/8')
      .set(headers)
      .send(invalidPostData);

    // Verificamos que el status sea 422 (Unprocessable Entity)
    expect(response.status).toBe(422);

    // Verificamos que la respuesta contenga el error para 'content'
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toHaveLength(1);

    const error = response.body.errors[0];
    expect(error.code).toBe('too_small');
    expect(error.message).toBe('Content is required');
    expect(error.path).toEqual(['content']);
  });

  
  it('Validar cuando el title se encuentra ausente dentro del request', async () => {
    const invalidPostData = {
      content: generateRandomString(20),  // Content válido, pero title no está presente
    };

    const response = await request(url)
      .put('/8')  // Actualizando el post con ID 3
      .set(headers)
      .send(invalidPostData);

    // Comprobamos que la respuesta tenga status 200
    expect(response.status).toBe(200);

    // Verificamos que la respuesta contenga el título y contenido correctos
    expect(response.body).toHaveProperty('id', 8);
    expect(response.body).toHaveProperty('authorId', 7);  // ID del autor debería mantenerse igual 
    expect(response.body).toHaveProperty('content', invalidPostData.content);  // El contenido cambia
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');
  });
});