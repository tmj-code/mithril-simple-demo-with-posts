import './style.css';
import m from 'mithril';

interface IPost {
    userId: number;
    id: number;
    title: string;
    body: string;
}

function PostList(): m.Component {
    let posts: IPost[] = [];
	
	m.request<IPost[]>({
		method: 'GET',
		url: 'https://jsonplaceholder.typicode.com/posts'
	}).then(data => posts = data);

    return {
        view: () => m('section.post-list',
			m('ul',
				posts.map(post => 
					m('li',
						m(m.route.Link, { href: `/posts/${post.id}` }, post.title),
                        m('button.button', { onclick: () => deletePost(post.id)}, 'X')
					)
				)
			),
			m(m.route.Link, { href: '/posts', className: 'button' }, 'Add new post')
		)
    };
}

function deletePost(postId: number): void {
    m.request({
        method: 'DELETE',
        url: `https://jsonplaceholder.typicode.com/posts/${postId}`
    });
}

function savePost(post: IPost): void {
    const isCreate = post.id === -1;
    m.request({
        method: isCreate ? 'POST' : 'PUT',
        url: 'https://jsonplaceholder.typicode.com/posts' + isCreate ? '' : `/${post.id}`,
        body: post
    })
}

function PostForm(): m.Component {
    let post: IPost = {
        userId: -1,
        id: -1,
        title: '',
        body: ''
    };

    const id = m.route.param('id');
    if (id) {
        m.request<IPost>({
            method: 'GET',
            url: `https://jsonplaceholder.typicode.com/posts/${id}`
        }).then(data => post = data);
    }

	return {
		view: () => m('form.post-form',
            m('label', 
                m('span', 'Title'), 
                m('input[type="text"]', { 
                    value: post.title,
                    onchange: (e: Event) => post.title = (e.target as HTMLInputElement).value
                })
            ),
            m('label', 
                m('span', 'Body'), 
                m('textarea', { 
                    value: post.body,
                    onchange: (e: Event) => post.body = (e.target as HTMLTextAreaElement).value
                })
            ),
            m('button.button[type="button"]', { 
                onclick: () => savePost(post) 
            }, 'Save')
        )
	};
}

function setupRouting(root: Element): void {
	m.route.prefix = '';
	
	m.route(root, '/', {
		'/': PostList,
		'/posts': PostForm,
		'/posts/:id': PostForm
	});
}

function App(): m.Component {
	return {
		view: () => m('div.app',
			m('header', 'Mithril Demo'),
			m('main', { oncreate: (vnode: m.VnodeDOM) => setupRouting(vnode.dom) }),
			m('footer', 'Mithril is easy yet powerful')
		)
	};
}

m.mount(document.body, App);
