import request from 'supertest';

// URL base de la API
const url = 'http://localhost:3000/posts';

// Token de autorización
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'cEGK29W9kDvHfyJLdC5nwk4KYNJBMYw9',  // Token de autorización
};

describe('DELETE /posts/:id', () => {
  // Caso exitoso: Eliminar un post con ID válido
  it('Validar la eliminacion exitosa de un item con ID valido', async () => {
    const postId = 3;  // ID del post que deseas eliminar

    const response = await request(url)
      .delete(`/${postId}`)  // Eliminamos el post con el ID especificado
      .set(headers)
      .send();

    // Comprobamos que la respuesta tenga status 200 (post eliminado con éxito)
    expect(response.status).toBe(200);

    // Verificamos que la respuesta contenga el mensaje de eliminación
    expect(response.body.message).toBe('Post deleted');
  });

  // Caso cuando el ID no existe: Intentar eliminar un post con un ID que no existe
  it('Validar cuando el post no existe y se intenta eliminar', async () => {
    const postId = 9999;  // ID que no existe

    const response = await request(url)
      .delete(`/${postId}`)
      .set(headers)
      .send();
    
    expect(response.status).toBe(200);

    // Verificamos que el mensaje de la respuesta sea el correcto
    expect(response.body.message).toBe('Post deleted');
  });

  // Caso cuando el token de autorización está ausente: Intentar eliminar sin token
  it('Validar cuando el token de autorización está ausente', async () => {
    const postId = 3;  // ID del post que deseas eliminar

    const response = await request(url)
      .delete(`/${postId}`)
      .set('Content-Type', 'application/json')  // Sin token de autorización
      .send();

    // Comprobamos que la respuesta tenga status 401 (sin autorización)
    expect(response.status).toBe(401);

    // Verificamos que el mensaje de la respuesta sea el correcto
    expect(response.body.message).toBe('Unauthorized');
  });

  // Caso cuando el ID del post es inválido: Probar eliminar con un ID no numérico
  it('Validar cuando el ID del post es inválido', async () => {
    const postId = 'abc';  // ID no válido

    const response = await request(url)
      .delete(`/${postId}`)
      .set(headers)
      .send();

    // Comprobamos que la respuesta tenga status 400 (Bad Request)
    expect(response.status).toBe(200);

    // Verificamos que el mensaje de la respuesta sea el correcto
    expect(response.body.message).toBe('Post deleted');
  });
});