/// <reference types="cypress" />
import { MailSlurp } from 'mailslurp-client';

const mailslurp = new MailSlurp({ apiKey: Cypress.env('MAILSLURP_API_KEY') });

// Función utilitaria para generar nombres únicos
const generarNombreOrganizacion = () => `Organización Prueba ${Math.floor(Math.random() * 100000)}`;

describe('Registro y verificación de email con MailSlurp', () => {
  it('debería registrar un usuario y verificarlo vía email', () => {
    const testData = {
      email: '',
      password: 'UnaContraseña123',
      inboxId: '',
      verificationLink: '',
    };

    // 1. Crear inbox de MailSlurp
    cy.then(async () => {
      const inbox = await mailslurp.createInbox();
      testData.email = inbox.emailAddress;
      testData.inboxId = inbox.id;
    });

    // 2. Registrar usuario en la app
    cy.then(() => {
      cy.visit('/auth/register');
      cy.get('[name="organizationName"]').type(generarNombreOrganizacion());
      cy.get('[name="firstName"]').type('Nombre Prueba');
      cy.get('[name="lastName"]').type('Apellido Prueba');
      cy.get('[name="email"]').type(testData.email);
      cy.get('[name="password"]').type(testData.password);
      cy.get('[name="repeatPassword"]').type(testData.password);
      cy.get('form button[type="submit"]').click(); // Más genérico y mantenible
    });

    cy.wait(2500);

    // 3. Esperar email de verificación
    cy.wrap(null).then(() => {
      return mailslurp.waitForLatestEmail(testData.inboxId, 60000).then(email => {
        console.log('📬 Email recibido:', email);

        // Verifica el subject
        expect(email.subject).to.contain('Verificación de cuenta - EduOrganizer');
        expect(email.body).to.contain('Verificá tu cuenta');

        // Parsear HTML y buscar link de verificación
        const parser = new DOMParser();
        const doc = parser.parseFromString(email.body, 'text/html');
        const link = Array.from(doc.querySelectorAll('a')).find(a => a.textContent.trim() === 'Verificar');

        if (link && link.href.includes('/auth/verify-account')) {
          testData.verificationLink = link.href;
          console.log('✅ Link de verificación encontrado:', link.href);
        } else {
          throw new Error('❌ No se encontró el enlace con texto "Verificar"');
        }
      }).catch(error => {
        console.error('⚠️ Error esperando el email:', error);
        throw error;
      });
    });

    // 4. Visitar el link de verificación
    cy.then(() => {
      cy.wait(3000); // Puede ajustarse según necesidad
      cy.visit(testData.verificationLink);
      cy.url().should('include', '/auth/verify-account');

      // Click en botón de confirmación
      cy.get('button').contains('Verificar').click(); // Reemplazá si el botón tiene otro texto

      // Validar mensaje de éxito
      cy.contains('Operación exitosa').should('be.visible');
    });
  });
  it('no debería permitir reutilizar el mismo link de verificación', () => {
    cy.visit(testData.verificationLink);
    cy.url().should('include', '/auth/verify-account');
    cy.get('button').contains('Verificar').click();
    cy.contains('No autorizado').should('be.visible');
  });
  
  it('debería mostrar error al acceder con un link de verificación expirado', () => {
    const expiredLink = Cypress.env('EXPIRED_VERIFICATION_LINK');
  
    cy.visit(expiredLink);
    cy.contains('Link inválido o expirado').should('be.visible');
  });
  
});


