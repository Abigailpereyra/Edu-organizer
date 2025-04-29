describe('Landig Page', () => {
  it('Ingreso a la página', () => {
    cy.visit('https://edu-organizer-qa.vercel.app/')
  })

  it('Redirección al login', () => {
    cy.visit('https://edu-organizer-qa.vercel.app/')
    cy.xpath('//*[@id="__next"]/header/div/div[2]/a').click()
  })
})