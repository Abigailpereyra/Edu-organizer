describe('Formulario de olvido de contraseña', () => {

    it('redirige correctamente desde la pantalla de login', () => {
      cy.visit('/auth/login');
      cy.contains('¿Olvidaste tu contraseña?').click();
      cy.url().should('include', '/auth/recover');
    });
  
    context('Interacción con el formulario de olvido de contraseña', () => {
      beforeEach(() => {
        cy.visit('/auth/recover');
      });
  
      it('muestra error si se deja el campo de email vacío', () => {
        cy.get('#__next > div > div > div > div > div > form > div > button').click();
        cy.contains('Campo obligatorio').should('be.visible');
      });
  
      it('muestra error si el email tiene formato inválido', () => {
        cy.get('#\\:r0\\:').type('correoInvalido');
        cy.get('#__next > div > div > div > div > div > form > div > button').click();
        cy.contains('Correo electrónico inválido').should('be.visible');
      });
  
      it('envía correctamente si el email es válido y registrado', () => {
        cy.intercept('POST', '/api/v1/auth/recoverPassword', {
          statusCode: 200,
          body: { message: 'Password recovery email sent' }
        }).as('resetRequest');
  
        cy.get('#\\:r0\\:').type('existe@correo.com');
        cy.get('#__next > div > div > div > div > div > form > div > button').click();
  
        cy.wait('@resetRequest');
        cy.contains('Te hemos enviado un correo electrónico para que puedas reiniciar tu contraseña.').should('be.visible');
        cy.contains('Operación exitosa').should('be.visible');
      });
  
      it('muestra mensaje si el correo no está registrado', () => {
        cy.intercept('POST', '/api/v1/auth/recoverPassword', {
            statusCode: 404,
            body: {errorCode: "E404_1", message: "User not found."}
          }).as('resetRequest');
          
          cy.get('#\\:r0\\:').type('noexiste@correo.com');
          cy.get('#__next > div > div > div > div > div > form > div > button').click();
          
          cy.wait('@resetRequest');
          
          // Verifica que el mensaje de error se muestra correctamente
          cy.contains('Usuario no encontrado.').should('be.visible');
          
          // Verifica que aparece una alerta roja o un toast
          cy.get('.notistack-SnackbarContainer').should('be.visible');          
      });
    });
  });
  