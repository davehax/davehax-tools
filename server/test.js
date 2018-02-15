const rp = require('request-promise');
const cheerio = require('cheerio');

let imageTest = () => {
    const options = {
        uri: 'https://www.instagram.com/p/Ba5HLKlj-ux/',
        transform: (body) => {
            // console.log(body);
            return cheerio.load(body);
        }
    }
    
    rp(options)
        .then(($) => {
            // looking for <meta property="og:image" content="https://instagram.fsyd4-1.fna.fbcdn.net/t51.2885-15/e35/22858066_286933651813045_6833344662162374656_n.jpg" />
            let imageMeta = $('meta[property="og:image"]');
            console.log(imageMeta.attr("content"));
        })
        .catch((err) => {
            throw err;
        });
}

let videoTest = () => {
    const options = {
        uri: 'https://www.instagram.com/p/BauWO_Bnc3K/',
        transform: (body) => {
            // console.log(body);
            return cheerio.load(body);
        }
    }
    
    rp(options)
        .then(($) => {
            // looking for <meta property="og:image" content="https://instagram.fsyd4-1.fna.fbcdn.net/t51.2885-15/e35/22858066_286933651813045_6833344662162374656_n.jpg" />
            let imageMeta = $('meta[property="og:video"]');
            console.log(imageMeta.attr("content"));
        })
        .catch((err) => {
            throw err;
        });
}

let multiRequest = () => {
    const options = {
        uri: 'https://www.instagram.com/p/Ba2cyAqn9e4XyBeKwmGQfKbJuDqQnbSJhtGwmM0/',
        transform: (body) => {
            console.log(body);
            return cheerio.load(body);
        }
    }
    
    rp(options)
        .then(($) => {
            // looking for <meta property="og:image" content="https://instagram.fsyd4-1.fna.fbcdn.net/t51.2885-15/e35/22858066_286933651813045_6833344662162374656_n.jpg" />
            let imageMeta = $('meta[property="og:video"]');
            console.log(imageMeta.attr("content"));
        })
        .catch((err) => {
            throw err;
        });

    
}

multiRequest();

// imageTest();
// videoTest();


// example request

// // POST request options
// let postOptions = {
//     method: 'POST',
//     headers: new Headers({
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//     }),
//     credentials: 'include',
//     body: JSON.stringify({
// 		url: 'https://www.instagram.com/p/Ba5HLKlj-ux/'
//     })
// }

// fetch("/instaloot", postOptions)
//     .then((res) => {
//         if (res.ok) {
//             return res.json();
//         }
//         else {
//             throw "It's not ok, captain. I WENT TOO RICKY RICARDO"
//         }
//     })
//     .catch((err) => {
//         console.error(err);
//     })