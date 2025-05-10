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
  
        cy.get('#\\:r0\\:').type('abigailnaomipereyra@gmail.com');
        cy.get('#__next > div > div > div > div > div > form > div > button').click();
  
        cy.contains('Te hemos enviado un correo electrónico para que puedas reiniciar tu contraseña.').should('be.visible');
        cy.contains('Operación exitosa').should('be.visible');
      });
  
      it('muestra mensaje si el correo no está registrado', () => {
          
          cy.get('#\\:r0\\:').type('noexiste@correo.com');
          cy.get('#__next > div > div > div > div > div > form > div > button').click();
      
          // Verifica que el mensaje de error se muestra correctamente
          cy.contains('Usuario no encontrado.').should('be.visible');
          
          // Verifica que aparece una alerta roja o un toast
          cy.get('.notistack-SnackbarContainer').should('be.visible');          
      });
    });
  });
  