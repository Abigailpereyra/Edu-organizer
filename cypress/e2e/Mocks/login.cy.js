describe('Login - Mocks (con credenciales inválidas)', () => {
    beforeEach(() => {
      cy.visit('/auth/login');
    });
  
    it('debería mostrar error si el usuario no existe', () => {
        cy.intercept('POST', '/api/v1/auth/login', {
          statusCode: 401,
          body: {errorCode: "E401_1", message: "Invalid credentials"},
        }).as('loginRequest');
      
        cy.get("#\\:r0\\:").type('fakeuser@mail.com');
        cy.get("#\\:r1\\:").type('wrongpassword');
        cy.get('#__next > div > div > div > div > div > form > div > button').click()
      
        cy.wait('@loginRequest');
        cy.xpath('//*[@id="notistack-snackbar"]').should('contain', 'Credenciales inválidas');
      });
      
  
    it('debería mostrar error si la contraseña es incorrecta', () => {

      cy.intercept('POST', '/api/v1/auth/login', {
        statusCode: 401,
        body: {errorCode: "E401_1", message: "Invalid credentials"},
        }).as('loginRequest');

      cy.get("#\\:r0\\:").type('testuser@mail.com');
      cy.xpath("//*[@id=':r1:']").type('testpassword123');

      cy.get('#__next > div > div > div > div > div > form > div > button').click()

      cy.wait('@loginRequest');
      cy.xpath('//*[@id="notistack-snackbar"]').should('contain', 'Credenciales inválidas');
    });
  
    it('debería mostrar error si el usuario no existe y la contraseña es incorrecta', () => {
      cy.intercept('POST', '/api/v1/auth/login', {
      statusCode: 401,
      body: {errorCode: "E401_1", message: "Invalid credentials" },
      }).as('loginRequest');
      
      cy.get("#\\:r0\\:").type('testuser@mail.com');
      cy.xpath("//*[@id=':r1:']").type('testpassword123');
      cy.get('#__next > div > div > div > div > div > form > div > button').click()

      cy.wait('@loginRequest');

      cy.xpath('//*[@id="notistack-snackbar"]').should('contain', 'Credenciales inválidas');
    });
  
    it('debería mostrar error si el usuario y la contraseña son incorrectos', () => {
        cy.intercept('POST', '/api/v1/auth/login', {
            statusCode: 401,
            body: {errorCode: "E401_1", message: "Invalid credentials" },
        }).as('loginRequest');
      cy.get("#\\:r0\\:").type('testuser@mail.com');
      cy.xpath("//*[@id=':r1:']").type('testpassword123');
      cy.get('#__next > div > div > div > div > div > form > div > button').click()
      cy.xpath('//*[@id="notistack-snackbar"]').should('contain', 'Credenciales inválidas');
    });
  });

describe('Login - Mocks (con credenciales válidas)', () => {
    beforeEach(() => {
      cy.visit('/auth/login');
    });
  
    it('debería iniciar sesión con usuario y contraseña válidos', () => {
      cy.intercept('POST', '/api/v1/auth/login', {
        statusCode: 200,
        body: { message: 'Login exitoso' },
      }).as('loginRequest');
  
      cy.get("#\\:r0\\:").type('existe@correo.com');
      cy.xpath("//*[@id=':r1:']").type('testpassword');

      cy.get('#__next > div > div > div > div > div > form > div > button').click()
      cy.wait('@loginRequest');

      cy.url().should('include', '/dashboard')
      cy.xpath('//*[@id="notistack-snackbar"]').should('contain', 'Login exitoso');
    });

  });