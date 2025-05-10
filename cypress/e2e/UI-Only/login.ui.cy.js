describe('Login - Validaciones de UI', () => {
    beforeEach(() => {
      cy.visit('/auth/login');
    });
  
    it('debería mostrar error si el usuario excede la cantidad de caracteres', () => {
      cy.get("#\\:r0\\:").type('a'.repeat(101)+'@mail.com');
      cy.xpath("//*[@id=':r1:']").type('testpassword');
      cy.get('#__next > div > div > div > div > div > form > div > button').click()
      cy.get('#\\:r0\\:-helper-text').should('contain', 'El campo debe tener entre 1 y 50 caracteres');
    });
  
    it('debería mostrar error si la contraseña excede la cantidad de caracteres', () => {
      cy.get("#\\:r0\\:").type('testuser@mail.com');
      cy.xpath("//*[@id=':r1:']").type('a'.repeat(101));
      cy.get('#__next > div > div > div > div > div > form > div > button').click()
      cy.get('#\\:r1\\:-helper-text').should('contain', 'Debe tener como máximo 16 caracteres');
    });
  
    it('debería mostrar error si el usuario tiene caracteres especiales', () => {
      cy.get("#\\:r0\\:").type('testuser!@#');
      cy.xpath("//*[@id=':r1:']").type('testpassword');
      cy.get('#__next > div > div > div > div > div > form > div > button').click()
      cy.get('#\\:r0\\:-helper-text').should('contain', 'Correo electrónico inválido.');
    });
  
    it('debería mostrar error si la contraseña está vacía', () => {
      cy.get("#\\:r0\\:").type('testuser@mail.com');
      cy.xpath("//*[@id=':r1:']").clear();
      cy.get('#__next > div > div > div > div > div > form > div > button').click()
      cy.get('#\\:r1\\:-helper-text').should('contain', 'Campo obligatorio');
    });
  
    it('debería mostrar error si el usuario está vacío', () => {
      cy.get("#\\:r0\\:").clear();
      cy.get("#\\:r1\\:").type('testpassword');
      cy.get('#__next > div > div > div > div > div > form > div > button').click()
      cy.get('#\\:r0\\:-helper-text').should('contain', 'Campo obligatorio');
    });
  
    it('debería mostrar error si el usuario y la contraseña están vacíos', () => {
      cy.get("#\\:r0\\:").clear();
      cy.get("#\\:r1\\:").clear();
      cy.get('#__next > div > div > div > div > div > form > div > button').click()
      cy.get('#\\:r0\\:-helper-text').should('contain', 'Campo obligatorio');
      cy.get('#\\:r1\\:-helper-text').should('contain', 'Campo obligatorio');
    });
  });
  