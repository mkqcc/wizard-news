const express = require('express')
const morgan = require('morgan')
const postBank = require('./postBank')
const timeAgo = require('node-time-ago')

const app = express()
const PORT = 1337

app.use(morgan('dev'))
app.use(express.static('public'))

app.get("/", (req, res) => {
    const posts = postBank.list()
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Wizard News</title>
        <link rel="stylesheet" href="style.css" />
    </head>
    <div class="news-list">
        <header><img src="logo.png" />Wizard News</header>
        ${posts.map(post => `
        <div class="news-item">
            <p>
                <span class="news-position">
                    <a href="/posts/${post.id}">${post.id}. ▲${post.title}</a></span>
                <small>(by ${post.name})</small>
            </p>
            <small class="news-info"> ${post.upvotes} upvotes | ${timeAgo(post.date)}</small>
        </div>
        `).join('')}
    </div>
</html>`

    res.send(html)
})

app.get('/posts/:id', (req, res) => {
    const id = req.params.id
    const post = postBank.find(id)
    try {
        if (!post.id) {
            throw new Error('404 Not Found')
        } else {
            res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Wizard News</title>
    </head>
        <header><img src="/logo.png" />Wizard News</header>
            <p>
                <span class="news-position">
                <span>${post.title} <small>(by ${post.name})</small></span>
                <p>${post.content}</p>
            </p>
    </html>`)
        }
    } catch (e) {
        res.status(404).send('Something went wrong')
    }
})

app.listen(PORT, () => console.log(`App listening in port ${PORT}`))