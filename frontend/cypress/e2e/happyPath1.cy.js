// 1. Registers successfully
// 2. Creates a new listing successfully
// 3. Updates the thumbnail and title of the listing successfully
// 4. Publish a listing successfully
// 5. Unpublish a listing successfully
// 6. Make a booking successfully
// 7. Logs out of the application successfully
// 8. Logs back into the application successfully
import 'cypress-file-upload';

const randomEmail = `anna${Math.floor(Math.random() * 100000)}@gmail.com`;

describe('Happy Path 1', () => {
  // 1. Registers successfully
  it('Registers successfully', () => {
    cy.visit('http://localhost:3000/register');
    cy.url().should('include', '/register');
    cy.get('input[name="email"]').type(randomEmail);
    cy.get('input[name="password"]').type('123456');
    cy.get('input[name="confirmPassword"]').type('123456');
    cy.get('input[name="name"]').type('Anna');
    // click on register button
    cy.get('button[name="register"]').click();
    cy.url().should('include', '/landing');
    
    // 2. Creates a new listing successfully
    cy.get('[name="nav"]').eq(1).click({ force: true });
    cy.url().should('include', '/hosted-listing');
    cy.get('button[name="createListing"]').click();
    cy.url().should('include', '/hosted-listing/add-listing');
    cy.get('input[name="title"]').type(`anna${Math.floor(Math.random() * 100000)}`);
    cy.get('input[name="price"]').type('100');
    cy.get('input[name="address"]').type('123 Main St');
    cy.get('[name="propertyType"]').parent().click();
    cy.contains('li', 'House').click();
    // Add bedroom button
    cy.get('button[name="addBedroom"]').click();
    cy.get('button[name="removeBedroom"]').click();
    cy.get('button[name="addBedroom"]').click();
    cy.get('input[name="bathrooms"]').type('2');
    // upload thumbnail
    cy.get('input[name="thumbnail"]').attachFile('/myHome.png');
    
    cy.intercept({
      method: 'POST',
      url: '/listings/new',
    }).as('createListing');
    cy.get('button[name="submit"]').click();
    cy.wait('@createListing');
    cy.url().should('include', '/hosted-listing');

    // 3. Updates the thumbnail and title of the listing successfully
    cy.get('button[name="editListing"]').click();
    cy.get('input[name="title"]').clear().type(`anna${Math.floor(Math.random() * 100000)}`);
    cy.get('input[name="thumbnail"]').attachFile('/happyDog.jpeg');
    cy.get('button[name="submit"]').click();
    cy.url().should('include', '/hosted-listing');

    // 4. Publish a listing successfully
    cy.get('button[name="publishing"]').click();
    // start date
    cy.get('input[name="startDate"]')
      .type('2023-01-01');
    // end date
    cy.get('input[name="endDate"]') 
      .type('2023-01-10'); 
    // click on publish button
    cy.get('button[name="publishAvailability"]').click();
    // navigate to landing page
    cy.get('[name="nav"]').eq(0).click({ force: true });

    // 5. Unpublish a listing successfully
    // navigate to hosted listing page
    cy.get('[name="nav"]').eq(1).click({ force: true });
    cy.url().should('include', '/hosted-listing');
    cy.get('button[name="publishing"]').click();

    // 6. Make a booking successfully
    // navigate to hosted listing page
    cy.get('[name="nav"]').eq(1).click({ force: true });
    cy.url().should('include', '/hosted-listing');
    // publish availability
    cy.get('button[name="publishing"]').click();
    // start date
    cy.get('input[name="startDate"]')
      .type('2023-01-01');
    // end date
    cy.get('input[name="endDate"]') 
      .type('2023-01-10'); 
    // click on publish button
    cy.get('button[name="publishAvailability"]').click();
    // logout
    cy.get('[name="logout"]').click();
    // register a new user
    cy.visit('http://localhost:3000/register');
    cy.get('input[name="email"]').type(`anna${Math.floor(Math.random() * 100000)}@gmail.com`);
    cy.get('input[name="password"]').type('123456');
    cy.get('input[name="confirmPassword"]').type('123456');
    cy.get('input[name="name"]').type('Anna');
    // click on register button
    cy.get('button[name="register"]').click();
    cy.url().should('include', '/landing');
    // click a card
    cy.get('div[name="card"]').eq(0).click();
    // Click on the available date
    // cy.get('input[name="startDate"]').click();
    // cy.get('input[name="startDate"]').type('010123');
    // cy.get('input[name="endDate"]').click();
    // cy.get('input[name="endDate"]').type('020123');
  });
});
  