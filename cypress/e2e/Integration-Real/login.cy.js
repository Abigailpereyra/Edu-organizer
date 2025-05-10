require('cypress-xpath')

describe('Login - Casos reales', () => {
    beforeEach(() => {
      cy.visit('/auth/login');
    });
  
    it('debería iniciar sesión con credenciales válidas', () => {
      cy.get("#\\:r0\\:").type(Cypress.env('VALID_USER'));
      cy.get("#\\:r1\\:").type(Cypress.env('VALID_PASS'));
      cy.get('form button').click();
      cy.url().should('include', '/dashboard');
    });
  
    it('debería mostrar error con contraseña incorrecta', () => {
      cy.get("#\\:r0\\:").type(Cypress.env('VALID_USER'));
      cy.get("#\\:r1\\:").type('claveIncorrecta');
      cy.get('form button').click();
      cy.xpath('//*[@id="notistack-snackbar"]').should('contain', 'Credenciales inválidas');
    });
  
    it('debería mostrar error con usuario inválido', () => {
      cy.get("#\\:r0\\:").type('noexiste@mail.com');
      cy.get("#\\:r1\\:").type('clave123');
      cy.get('form button').click();
      cy.xpath('//*[@id="notistack-snackbar"]').should('contain', 'Credenciales inválidas');
    });
  });
  

describe('Login - Pruebas positivas', () => {
    beforeEach(() => {
      cy.visit('/auth/login')
    })
  
    it('debería iniciar sesión con usuario y contraseña válidos', () => {
      cy.get("#\\:r0\\:").type('testuser')
      cy.get("#\\:r1\\:").type('testpassword')
      cy.get('#__next > div > div > div > div > div > form > div > button').click()
    })
  
    it('debería redirigir al dashboard tras el login', () => {
        cy.get("#\\:r0\\:").type('testuser')
        cy.get("#\\:r1\\:").type('testpassword')
        cy.get('#__next > div > div > div > div > div > form > div > button').click()
        cy.url().should('include', '/dashboard')
        cy.xpath('//*[@id="notistack-snackbar"]').should('contain', 'Credenciales inválidas')
        })

  })
  
  describe('Login - Pruebas negativas', () => {
    beforeEach(() => {
      cy.visit('/auth/login')
    })
  
    it('debería mostrar error si el usuario no existe', () => {
        cy.get("#\\:r0\\:").type('testuser@mail.com')
        cy.xpath("//*[@id=':r1:']").type('testpassword')
        cy.get('#__next > div > div > div > div > div > form > div > button').click()
        cy.xpath('//*[@id="notistack-snackbar"]').should('contain', 'Credenciales inválidas')
    })
    it('debería mostrar error si la contraseña es incorrecta', () => {
        cy.get("#\\:r0\\:").type('testuser@mail.com')
        cy.xpath("//*[@id=':r1:']").type('testpassword123')
        cy.get('#__next > div > div > div > div > div > form > div > button').click()
        cy.xpath('//*[@id="notistack-snackbar"]').should('contain', 'Credenciales inválidas')
    })
    it('debería mostrar error si el usuario no existe y la contraseña es incorrecta', () => {
        cy.get("#\\:r0\\:").type('testuser@mail.com')
        cy.xpath("//*[@id=':r1:']").type('testpassword123')
        cy.get('#__next > div > div > div > div > div > form > div > button').click()
        cy.xpath('//*[@id="notistack-snackbar"]').should('contain', 'Credenciales inválidas')

    })
    it('debería mostrar error si el usuario y la contraseña son incorrectos', () => {
        cy.get("#\\:r0\\:").type('testuser@mail.com')
        cy.xpath("//*[@id=':r1:']").type('testpassword123')
        cy.get('#__next > div > div > div > div > div > form > div > button').click()
        cy.xpath('//*[@id="notistack-snackbar"]').should('contain', 'Credenciales inválidas')
    })
    it('deberia mostrar error si el usuario excede la cantidad de caracteres', () => {
        cy.get("#\\:r0\\:").type('testuser12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890')
        cy.xpath("//*[@id=':r1:']").type('testpassword')
        cy.get('#__next > div > div > div > div > div > form > div > button').click()
        cy.get('#\\:r0\\:-helper-text').should('contain', 'El campo debe tener entre 1 y 50 caracteres')
    })
    it('debería mostrar error si la contraseña excede la cantidad de caracteres', () => {
        cy.get("#\\:r0\\:").type('testuser@mail.com')
        cy.xpath("//*[@id=':r1:']").type('testpassword12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890')
        cy.get('#__next > div > div > div > div > div > form > div > button').click()
        cy.get('#\\:r1\\:-helper-text').should('contain', 'El campo debe tener entre 1 y 50 caracteres')
    })
    it('debería mostrar error si el usuario tiene caracteres especiales', () => {
        cy.get("#\\:r0\\:").type('testuser!@#')
        cy.xpath("//*[@id=':r1:']").type('testpassword')
        cy.get('#__next > div > div > div > div > div > form > div > button').click()
        cy.get('#\\:r0\\:-helper-text').should('contain', 'Correo electrónico inválido.')
    })

    it('debería mostrar error si la contraseña está vacía', () => {
        cy.get("#\\:r0\\:").type('testuser@mail.com')
        cy.xpath("//*[@id=':r1:']").clear()
        cy.get('#__next > div > div > div > div > div > form > div > button').click()
        cy.get('#\\:r1\\:-helper-text').should('contain', 'Campo obligatorio')
    })
    it('debería mostrar error si el usuario está vacío', () => {
        cy.get("#\\:r0\\:").clear()
        cy.get("#\\:r1\\:").type('testpassword')
        cy.get('#__next > div > div > div > div > div > form > div > button').click()
        cy.get('#\\:r0\\:-helper-text').should('contain', 'Campo obligatorio')
    })
    it('debería mostrar error si el usuario y la contraseña están vacíos', () => {
        cy.get("#\\:r0\\:").clear()
        cy.get("#\\:r1\\:").clear()
        cy.get('#__next > div > div > div > div > div > form > div > button').click()
        cy.get('#\\:r0\\:-helper-text').should('contain', 'Campo obligatorio')
        cy.get('#\\:r1\\:-helper-text').should('contain', 'Campo obligatorio')
    })
})