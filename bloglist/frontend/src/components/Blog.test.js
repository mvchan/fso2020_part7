import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { act } from 'react-dom/test-utils'

test('by default, only the blog\'s title and author are displayed', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Jest',
        url: 'test.url',
        likes: '989',
        user: 'testing'
    }

    const user = {
        username: 'jestTestUser'
    }

    const component = render(
        <Blog blog={blog} user={user} />
    )

    //const divComp = component.container.querySelector('div')
    //console.log(prettyDOM(divComp))

    component.debug()

    //method 1
    expect(component.container).toHaveTextContent(
        'Component testing is done with react-testing-library'
    )

    const blogViewDiv = component.container.querySelector('.blogView')
    expect(blogViewDiv).not.toHaveStyle('display: none')
    expect(blogViewDiv).not.toHaveTextContent('likes')
    expect(blogViewDiv).not.toHaveTextContent('url')

    const blogHideDiv = component.container.querySelector('.blogHide')
    expect(blogHideDiv).toHaveStyle('display: none')
    expect(blogHideDiv).toHaveTextContent('likes')
    expect(blogHideDiv).toHaveTextContent('url')

    // method 2
    //const element = component.getByText(
    //    /Component testing is done with react-testing-library/
    //)
    //expect(element).toBeDefined()

    // method 3
    //const div = component.container.querySelector('.blog')
    //expect(div).toHaveTextContent(
    //    'Component testing is done with react-testing-library'
    //)
})

test('clicking the view button displays url and likes', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Jest',
        url: 'test.url',
        likes: '989',
        user: {
            username: 'jestTestUser'
        }
    }

    const user = {
        username: 'jestTestUser'
    }

    const component = render(
        <Blog blog={blog} user={user} />
    )

    const button = component.container.querySelector('.view')
    fireEvent.click(button)

    const blogViewDiv = component.container.querySelector('.blogView')
    expect(blogViewDiv).toHaveStyle('display: none')
    expect(blogViewDiv).not.toHaveTextContent('likes')
    expect(blogViewDiv).not.toHaveTextContent('url')

    const blogHideDiv = component.container.querySelector('.blogHide')
    expect(blogHideDiv).not.toHaveStyle('display: none')
    expect(blogHideDiv).toHaveTextContent('likes')
    expect(blogHideDiv).toHaveTextContent('url')
})

test('clicking the like button twice calls mock event handler twice', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Jest',
        url: 'test.url',
        likes: '989',
        user: {
            username: 'jestTestUser'
        }
    }

    const user = {
        username: 'jestTestUser'
    }

    const mockHandler = jest.fn()

    const component = render(
        <Blog blog={blog} user={user} likeOperation={mockHandler} />
    )

    const button = component.container.querySelector('.like')

    act(() => {
        fireEvent.click(button)
        fireEvent.click(button)
    })

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates parent states and calls onSubmit', () => {
    const createBlog = jest.fn()

    const component = render(
        <BlogForm createBlog={createBlog} />
    )

    const form = component.container.querySelector('form')
    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')

    fireEvent.change(title, {
        target: { value: 'testing of forms could be easier' }
    })
    fireEvent.change(author, {
        target: { value: 'test author' }
    })
    fireEvent.change(url, {
        target: { value: 'test url' }
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('testing of forms could be easier')
    expect(createBlog.mock.calls[0][0].author).toBe('test author')
    expect(createBlog.mock.calls[0][0].url).toBe('test url')
})

/*
describe('<Togglable />', () => {
    let component

    beforeEach(() => {
        component = render(
            <Togglable buttonLabel="show...">
                <div className="testDiv" />
            </Togglable>
        )
    })

    test('renders its children', () => {
        expect(
            component.container.querySelector('.testDiv')
        ).toBeDefined()
    })

    test('at start the children are not displayed', () => {
        const div = component.container.querySelector('.togglableContent')

        expect(div).toHaveStyle('display: none')
    })

    test('after clicking the button, children are displayed', () => {
        const button = component.getByText('show...')
        fireEvent.click(button)

        const div = component.container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')
    })

    test('toggled content can be closed', () => {
        const button = component.getByText('show...')
        fireEvent.click(button)

        const closeButton = component.getByText('cancel')
        fireEvent.click(closeButton)

        const div = component.container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })
})


*/