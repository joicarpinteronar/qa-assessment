import request from 'supertest';

describe('POST /auth/login', () => {
  const url = 'http://localhost:3000/auth/login';

  // Datos de entrada válidos
  const validRequestData = {
    username: 'testuser',
    password: 'testpassword',
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'cEGK29W9kDvHfyJLdC5nwk4KYNJBMYw9',
  };

  it('Validar el Login de manera exitosa', async () => {
    const response = await request(url)
      .post('')
      .set(headers)
      .send(validRequestData);

    // Comprobamos que la respuesta sea un 200 (OK)
    expect(response.status).toBe(200);

    // Verificamos la estructura de la respuesta
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('createdAt');

    // Verificamos que los valores esperados estén presentes
    expect(typeof response.body.id).toBe('number');
    expect(typeof response.body.userId).toBe('number');
    expect(typeof response.body.token).toBe('string');
    expect(Date.parse(response.body.createdAt)).toBeGreaterThan(0);
  });

  it('Validar el login con credenciales invalidas', async () => {
    const invalidRequestData = {
      username: 'wronguser',  // Usuario incorrecto
      password: 'wrongpassword',  // Contraseña incorrecta
    };

    const response = await request(url)
      .post('')
      .set(headers)
      .send(invalidRequestData);

    // Comprobamos que la respuesta sea un error 400 (Bad Request)
    expect(response.status).toBe(422);

    // Verificamos que el cuerpo de la respuesta contenga el mensaje esperado
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });
});