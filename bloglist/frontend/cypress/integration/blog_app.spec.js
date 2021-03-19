//It is recommended that arrow functions are not used, because they might cause some issues in certain situations.

describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Mark Test',
            username: 'mac10test',
            password: 'pass456test'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
        cy.contains('Blogs')
        cy.contains('login')
    })

    describe('Login',function() {
        it('succeeds with correct credentials', function() {
            cy.contains('login').click()
            cy.get('#username').type('mac10test')
            cy.get('#password').type('pass456test')
            cy.get('#login-button').click()
            cy.contains('Mark Test logged in')
        })

        it('fails with wrong credentials', function() {
            cy.contains('login').click()
            cy.get('#username').type('unknown')
            cy.get('#password').type('unknown')
            cy.get('#login-button').click()

            cy.get('.error').should('contain', 'wrong username or password')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
                .and('have.css', 'border-style', 'solid')

            cy.get('html').should('not.contain', 'Mark Test logged in')
        })
    })

    describe('When logged in', function() {
        beforeEach(function() {

            // cy.contains('login').click()
            // cy.get('input:first').type('mac10test')
            // cy.get('input:last').type('pass456test')
            // cy.get('#login-button').click()

            //bypass method
            cy.login({ username: 'mac10test', password: 'pass456test' })
        })

        it('A blog CAN be created', function() {

            cy.contains('create new blog').click()
            cy.get('#title').type('cypress blog title')
            cy.get('#author').type('cypress blog author')
            cy.get('#url').type('cypress blog url')
            cy.get('#create-button').click()

            cy.contains('cypress blog title')
            cy.get('.error').should('contain', 'has been added')
                .and('have.css', 'color', 'rgb(0, 128, 0)')
                .and('have.css', 'border-style', 'solid')
        })

        it('A blog CAN be liked', function() {
            //bypass method
            cy.createBlog({
                title:'cypress blog title for like test',
                author:'cypress blog author for like test',
                url:'cypress blog url for like test'
            })
            cy.get('.view').click()
            cy.get('.like').click()
            cy.contains('likes: 1')
        })

        it('A blog CAN be deleted by the original user', function() {
            cy.createBlog({
                title:'cypress blog title for delete test',
                author:'cypress blog author for delete test',
                url:'cypress blog url for delete test'
            })

            cy.get('#blog-list').should('contain','cypress blog title for delete test')

            cy.get('.view').click()
            cy.get('.delete').should('exist').click()

            cy.get('.error').should('contain', 'has been deleted')
                .and('have.css', 'color', 'rgb(0, 128, 0)')
                .and('have.css', 'border-style', 'solid')

            cy.get('#blog-list').should('not.contain','cypress blog title for delete test')
        })

        it('A blog CANNOT be deleted by any other user', function() {
            cy.createBlog({
                title:'cypress blog title for delete test',
                author:'cypress blog author for delete test',
                url:'cypress blog url for delete test'
            })

            const user = {
                name: 'Another User',
                username: 'other',
                password: 'other'
            }
            cy.request('POST', 'http://localhost:3001/api/users/', user)

            cy.login({ username: 'other', password: 'other' })

            cy.get('#blog-list').should('contain','cypress blog title for delete test')
            cy.get('.view').click()
            cy.get('.delete').should('not.exist')
        })

        it('All blogs are listed in descending order of likes', function() {
            cy.createBlog({
                title:'blog with no likes',
                author:'test user',
                url:'test.io'
            })

            cy.createBlog({
                title:'blog with 10 likes',
                author:'test user',
                url:'test.io',
                likes: 10
            })

            cy.createBlog({
                title:'blog with 55 likes',
                author:'test user',
                url:'test.io',
                likes: 55
            })

            cy.get('.blogEntry')
                .children('.blogHide')
                .as('likeList')

            // blogTwo should be first
            cy.get('@likeList')
                .first()
                .should('contain.text', 'likes: 55')

            // blogOne should be last
            cy.get('@likeList')
                .last()
                .should('contain.text', 'likes: 0')
        })
    })
})