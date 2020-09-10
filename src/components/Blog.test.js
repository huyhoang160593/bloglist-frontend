import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />',() => {
  let component
  let initialBlog = {
    title: 'You shouldn\'t do this or you will get a bad ending',
    author: 'Quan Hai Hai',
    url: 'https://www.4chan.org',
    likes: 17,
  }

  const mockHandler = jest.fn()

  beforeEach(() => {
    component = render(
      <Blog blog={initialBlog} handleLike={mockHandler}/>
    )
  })

  test('component renders the title and author', () => {
    const div = component.container.querySelector('.generalInfo')
    expect(div)
      .toHaveTextContent('Quan Hai Hai')
    expect(div)
      .toHaveTextContent('You shouldn\'t do this or you will get a bad ending')
  })

  test('component not renders its url or number or likes by default', () => {
    const div = component.container.querySelector('.detailInfoHidden')
    expect(div).toHaveStyle('display : none')
  })

  test('after clicking the button, the url and like are displayed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.detailInfoHidden')
    expect(div).not.toHaveStyle('display : none')
  })

  test('if like button is clicked twice, the event handler the component received as props is called twice', () => {
    const button = component.getByText('like')
    fireEvent.click(button)
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})