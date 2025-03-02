const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === '/') {
        fs.readFile('./public/home.html', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    else if (pathname === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>About Pokemon</h1>
            <p>This is a simple website about three random Pokemon: Pikachu, Charmander, and Bulbasaur.</p>
            <a href="/">Home</a>
        `);
    }
    else if (pathname === '/pokemon') {
        const pokemonName = query.name;
        if (pokemonName) {
            fs.readFile(`./public/${pokemonName}.txt`, (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('Pokémon not found');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(`
                        <h1>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h1>
                        <p>${data}</p>
                        <a href="/">Home</a>
                    `);
                }
            });
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Please specify a Pokemon name in the query string (e.g., ?name=pikachu)');
        }
    }
    else if (pathname.match(/\.(jpg|jpeg|png)$/)) {
        const imagePath = path.join(__dirname, 'public', pathname);
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.end(data);
            }
        });
    }
    else if (pathname === '/random') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <h1>Random Pokemon Fact</h1>
            <p>Did you know, There are 151 pokemon in the first gen and 120 in the 9th gen ?</p>
            <a href="/">Home</a>
        `);
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});