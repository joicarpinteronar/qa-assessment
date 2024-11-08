import request from 'supertest';

// Función para generar cadenas alfanuméricas aleatorias
function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

describe('POST /posts', () => {
  const url = 'http://localhost:3000/posts';

  // Generación dinámica de datos para la prueba
  const validPostData = {
    title: generateRandomString(10), // Genera un título aleatorio de 10 caracteres
    content: generateRandomString(20), // Genera un contenido aleatorio de 20 caracteres
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'cEGK29W9kDvHfyJLdC5nwk4KYNJBMYw9',  // Token de autorización
  };

  it('Validar la creacion exitosa de los items y devolver datos correctos', async () => {
    const response = await request(url)
      .post('')
      .set(headers)
      .send(validPostData);

    // Comprobamos que la respuesta sea 201 (creación exitosa)
    expect(response.status).toBe(201);

    // Verificamos que la respuesta contenga los campos esperados
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('authorId');
    expect(response.body).toHaveProperty('title', validPostData.title);  // Validamos que el 'title' coincida
    expect(response.body).toHaveProperty('content', validPostData.content);  // Validamos que el 'content' coincida
    expect(response.body).toHaveProperty('createdAt');
    expect(response.body).toHaveProperty('updatedAt');

    // Verificamos los tipos de las propiedades
    expect(typeof response.body.id).toBe('number');
    expect(typeof response.body.authorId).toBe('number');
    expect(typeof response.body.createdAt).toBe('string');
    expect(typeof response.body.updatedAt).toBe('string');

    // Comprobamos que las fechas sean válidas
    expect(Date.parse(response.body.createdAt)).toBeGreaterThan(0);
    expect(Date.parse(response.body.updatedAt)).toBeGreaterThan(0);

    // Aseguramos que el 'title' y 'content' en la respuesta sean los mismos que enviamos
    expect(response.body.title).toBe(validPostData.title);  // Validación explícita de 'title'
    expect(response.body.content).toBe(validPostData.content);  // Validación explícita de 'content'
  });

  it('Validar errores del servicio cuando el titulo esta vacio', async () => {
    const invalidPostData = {
        title: '',  // Título vacío
        content: generateRandomString(20),  // Contenido válido
      };
  
      const response = await request(url)
        .post('')
        .set(headers)
        .send(invalidPostData);
  
      // Comprobamos que la respuesta sea 400 (Bad Request)
      expect(response.status).toBe(422);
  
      // Verificamos que el cuerpo de la respuesta contenga el error esperado para 'title'
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);
  
      const error = response.body.errors[0];
  
      // Verificamos que el código de error sea 'too_small' y el mensaje sea 'Title is required'
      expect(error.code).toBe('too_small');
      expect(error.message).toBe('Title is required');
      expect(error.path).toEqual(['title']);
  });

  it('Validar errores del servicio cuando el contenido esta vacio', async () => {
    const invalidPostData = {
        title: generateRandomString(10),  // Título válido
        content: '',  // Contenido vacío
      };
  
      const response = await request(url)
        .post('')
        .set(headers)
        .send(invalidPostData);
  
      // Comprobamos que la respuesta sea 400 (Bad Request)
      expect(response.status).toBe(422);
  
      // Verificamos que el cuerpo de la respuesta contenga los errores esperados para 'title' y 'content'
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toHaveLength(1);
  
      const errors = response.body.errors;      
  
      // Verificamos el error para 'content'
      expect(errors[0].code).toBe('too_small');
      expect(errors[0].message).toBe('Content is required');
      expect(errors[0].path).toEqual(['content']);
  });
});