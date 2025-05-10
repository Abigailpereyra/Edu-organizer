/// <reference types="cypress" />
describe('Registro de usuario (Mock)', () => {
  const fakeEmail = 'usuario@fake.com';
  const fakePassword = 'UnaContraseña123';
  const fakeVerificationLink = '/auth/verify-account?token=123';

  it('debería registrar un usuario y mostrar mensaje de confirmación', () => {
    cy.intercept('POST', '/api/v1/auth/register', {
      statusCode: 200,
      body: { message: 'Registro exitoso. Verificá tu email.' }
    }).as('registerRequest');

    cy.visit('/auth/register');
    cy.get('[name="organizationName"]').type('Org Prueba Mock');
    cy.get('[name="firstName"]').type('Nombre');
    cy.get('[name="lastName"]').type('Apellido');
    cy.get('[name="email"]').type(fakeEmail);
    cy.get('[name="password"]').type(fakePassword);
    cy.get('[name="repeatPassword"]').type(fakePassword);
    cy.get('form button[type="submit"]').click();

    cy.wait('@registerRequest');
    cy.contains('Registro exitoso. Verificá tu email.').should('be.visible');
  });

  it('simula visitar el link de verificación', () => {
    cy.intercept('GET', '/api/v1/auth/verify-account*', {
      statusCode: 200,
      body: { message: 'Cuenta verificada correctamente' }
    }).as('verifyRequest');

    cy.visit(fakeVerificationLink);
    cy.get('button').contains('Verificar').click();
    cy.wait('@verifyRequest');
    cy.contains('Operación exitosa').should('be.visible');
  });

  it('simula un link de verificación expirado', () => {
    cy.intercept('GET', '/api/v1/auth/verify-account*', {
      statusCode: 401,
      body: { message: 'Link inválido o expirado' }
    }).as('expiredLink');

    cy.visit('/auth/verify-account?token=expirado');
    cy.wait('@expiredLink');
    cy.contains('Link inválido o expirado').should('be.visible');
  });
});



