import request from 'supertest';

// URL base de la API
const url = 'http://localhost:3000/posts';

// Token de autorización
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'cEGK29W9kDvHfyJLdC5nwk4KYNJBMYw9',  // Token de autorización
};

describe('GET /posts', () => {
  
  // Caso exitoso: Obtener todos los posts
  it('Debe retornar una lista de items con datos válidos', async () => {
    const response = await request(url)
      .get('/')  // Realizamos una solicitud GET a la URL de posts
      .set(headers)  // Añadimos los encabezados de autenticación
      .send();

    // Verificamos que la respuesta tenga status 200 (éxito)
    expect(response.status).toBe(200);

    // Verificamos que la respuesta contenga un array
    expect(Array.isArray(response.body)).toBe(true);

    // Verificamos que cada objeto en el array tenga las propiedades correctas
    response.body.forEach((post: any) => {
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('authorId');
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('content');
      expect(post).toHaveProperty('createdAt');
      expect(post).toHaveProperty('updatedAt');
    });

    // También puedes verificar si los valores son razonables
    expect(response.body[0].id).toBeGreaterThan(0);  // Los IDs deben ser números mayores que 0
  });

  // Caso cuando no hay posts disponibles
  it('Validar cuando no hay posts disponibles', async () => {
    
    const response = await request(url)
      .get('/')
      .set(headers)
      .send();

    expect(response.status).toBe(200);  // Deberíamos recibir un status 200   
  });

  // Caso cuando se proporciona un token inválido
  it('Validar la consulta cuando el token es inválido', async () => {
    const invalidHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'InvalidToken',  // Token incorrecto
    };

    const response = await request(url)
      .get('/')
      .set(invalidHeaders)
      .send();

    // Verificamos que la respuesta tenga status 401 (no autorizado)
    expect(response.status).toBe(401);

    // Verificamos que el mensaje sea el esperado para un token inválido
    expect(response.body.message).toBe('Unauthorized');
  });

  // Caso cuando no se proporciona el token
  it('Validar el servicio cuando no se proporciona el token', async () => {
    const response = await request(url)
      .get('/')
      .send();  // No enviamos el token en este caso

    // Verificamos que la respuesta tenga status 401
    expect(response.status).toBe(401);

    // Verificamos que el mensaje sea el esperado para un token ausente
    expect(response.body.message).toBe('Unauthorized');
  });
});
