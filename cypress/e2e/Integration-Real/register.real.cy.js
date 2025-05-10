/// <reference types="cypress" />
import { MailSlurp } from 'mailslurp-client';

const mailslurp = new MailSlurp({ apiKey: Cypress.env('MAILSLURP_API_KEY') });
const randomOrgName = `Organización Prueba ${Math.floor(Math.random() * 100000)}`;

describe('Registro y verificación de email con MailSlurp', () => {
  it('debería registrar un usuario y verificarlo vía email', () => {
    const testData = {
      email: '',
      password: 'UnaContraseña123',
      inboxId: '',
      verificationLink: '',
    };

    // 1. Crear inbox
    cy.then(async () => {
      const inbox = await mailslurp.createInbox();
      testData.email = inbox.emailAddress;
      testData.inboxId = inbox.id;
    });

    // 2. Registrar usuario
    cy.then(() => {
      cy.visit('/auth/register');
      cy.get('[name="organizationName"]').type(randomOrgName);
      cy.get('[name="firstName"]').type('Nombre Prueba');
      cy.get('[name="lastName"]').type('Apellido Prueba');
      cy.get('[name="email"]').type(testData.email);
      cy.get('[name="password"]').type(testData.password);
      cy.get('[name="repeatPassword"]').type(testData.password);
      cy.get('#__next > div > div > div > div > div > form > div > button').click();
    });

    cy.wait(2500);

    // 3. Esperar el email de verificación con una promesa controlada
    cy.wrap(null).then(() => {
      return mailslurp.waitForLatestEmail(testData.inboxId, 60000) // Aumenta el tiempo de espera a 60 segundos
        .then(email => {
          console.log('Email recibido:', email);

          // Verificar que el subject contiene "Verificá tu cuenta"
          expect(email.subject).to.contain('Verificación de cuenta - EduOrganizer');

          console.log('📩 Contenido del email:', email.body);
         // Verificar que el cuerpo del email contiene "Verificá tu cuenta"
            expect(email.body).to.contain('Verificá tu cuenta');
          // Buscar el enlace cuyo texto visible sea "Verificar"
        const parser = new DOMParser();
        const doc = parser.parseFromString(email.body, "text/html");
        const allLinks = Array.from(doc.querySelectorAll("a"));

        const verificarLink = allLinks.find(link => link.textContent.trim() === "Verificar");

        if (verificarLink && verificarLink.href.includes('/auth/verify-account')) {
            testData.verificationLink = verificarLink.href;
            console.log('✅ Enlace de verificación encontrado:', verificarLink.href);
        } else {
        throw new Error('❌ No se encontró el enlace con texto "Verificar"');
        }                

        })
        .catch(error => {
          console.error('Error esperando email:', error);
          throw error;
        });
    });

    // 4. Usar el link para verificar la cuenta
    cy.then(() => {
        cy.wait(5000)
        cy.visit(testData.verificationLink); // Navega al enlace de verificación
        cy.url().should('include', '/auth/verify-account'); // Verifica que estés en la página esperada
      
        // Si hay un botón para confirmar, hacé click
        cy.get("#__next > div > div > div > div > div > button").click();
      
        // Validamos que aparezca un mensaje exitoso
        cy.contains('Operación exitosa').should('be.visible');
      });
  });

  it('debería mostrar error al acceder con un link de verificación expirado', () => {
    const expiredLink = Cypress.env('EXPIRED_VERIFICATION_LINK');
  
    cy.visit(expiredLink);
    cy.contains('Link inválido o expirado').should('be.visible');
  });

});
