describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user1 = {
      name:'Nancy Uaena',
      username: 'iulover99',
      password: 'manwol'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user1)

    const user2 = {
      name:'Unknown Entity',
      username: 'scp232',
      password: 'manwol'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user2)

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('input:first').type('iulover99')
      cy.get('input:last').type('manwol')
      cy.get('#login-button').click()
      cy.contains('Nancy Uaena has logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input:first').type('iulover99')
      cy.get('input:last').type('wrongshit')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.get('html').should('not.contain', 'Nancy Uaena has logged in')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: 'iulover99', password: 'manwol' })
      })

      it('A blog can be created', function() {
        cy.contains('create new blog').click()
        cy.get('#title').type('Eloquent JavaScript')
        cy.get('#author').type('Marijn Haverbeke')
        cy.get('#url').type('https://eloquentjavascript.net')
        cy.get('#create-button').click({})

        cy.contains('Eloquent JavaScript')
          .contains('Marijn Haverbeke')
      })

      describe('and a blog exist', function() {
        beforeEach(function() {
          cy.createBlog({
            title: 'Eloquent JavaScript',
            author: 'Marijn Haverbeke',
            url: 'https://eloquentjavascript.net',
          })

          cy.createBlog({
            title: 'Ditme-PhongcachngonnguViet',
            author: 'ChuQuan',
            url: 'https://ditmemay.net',
            likes: 27
          })

          cy.createBlog({
            title: 'Valon-Daucatmoi',
            author: 'choan',
            url: 'https://cuocsongma.net',
            likes: 29
          })
        })

        it('it can be like by user', function() {
          cy.contains('view').click()
          cy.contains('like').click()

          cy.contains('likes 30')
        })

        it('it can be delete by the owner user', function() {
          cy.contains('view').click()
          cy.contains('remove').click()

          cy.contains('The blog Valon-Daucatmoi by choan has been removed')
        })


        it('but can\'t be delete by another one', function(){
          cy.contains('logout').click()
          cy.get('input:first').type('scp232')
          cy.get('input:last').type('manwol')
          cy.get('#login-button').click()

          cy.contains('view').click()
          cy.get('html').should('not.contain', 'remove')
        })

        it('the blogs are ordered according to likes with the blog with the most like being first', function() {
          cy.contains('view').click()
          cy.contains('view').click()
          cy.contains('view').click()
          cy.get('.likeCount').then( count => {
            cy.wrap(count[0]).contains('29')
            cy.wrap(count[1]).contains('27')
            cy.wrap(count[2]).contains('0')
          })
        })
      })
    })
  })
})