import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog = {createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')

  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'You shouldn\'t do this or you will get a bad ending' }
  })
  fireEvent.change(author, {
    target: { value: 'Quan Hai Hai' }
  })
  fireEvent.change(url, {
    target: { value: 'https://www.4chan.org' }
  })

  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('You shouldn\'t do this or you will get a bad ending')
  expect(createBlog.mock.calls[0][0].author).toBe('Quan Hai Hai')
  expect(createBlog.mock.calls[0][0].url).toBe('https://www.4chan.org')
})