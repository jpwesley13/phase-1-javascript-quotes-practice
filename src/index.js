const urlBar = 'http://localhost:3000/quotes';

const addQuotes = () => {
    fetch(urlBar + '?_embed=likes')
    .then (res => res.json())
    .then(data => listQuote(data))
    .catch(error => console.error(error))
};

const quoteList = document.querySelector('#quote-list')

const listQuote = (quotes) => {
    quotes.forEach(quote => {
        let card = document.createElement('li');
        card.innerHTML = '';
        card.className = 'quote-card';
        card.innerHTML = `
        <blockquote class = "blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>0</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>`

      quoteList.appendChild(card);

      //like
      card.querySelector('.btn-success').addEventListener('click', () => {
        fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({quoteId: quote.id})
    })
    .then(res => res.json())
    .then(newLike => {
        const likesSpan = card.querySelector('span');
        let currentLikes = parseInt(likesSpan.textContent);
        likesSpan.textContent = currentLikes + 1;
    })
    .catch(error => console.error(error))
      })
    // card.querySelector('.btn-success').addEventListener('click', () => {
    //     fetch(`${urlBar}/${quote.id}`, {
    //       method: 'GET',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Accept: 'application/json'
    //       }
    //     })
    //       .then(res => res.json())
    //       .then(quoteData => {
    //         const updatedLikes = quoteData.likes ? quoteData.likes + 1 : 1;
    //         return fetch(`${urlBar}/${quote.id}`, {
    //           method: 'PATCH',
    //           headers: {
    //             'Content-Type': 'application/json',
    //             Accept: 'application/json'
    //           },
    //           body: JSON.stringify({ likes: updatedLikes })
    //         });
    //       })
    //       .then(res => res.json())
    //       .then(updatedQuote => {
    //         const likesSpan = card.querySelector('span');
    //         likesSpan.textContent = updatedQuote.likes;
    //       })
    //       .catch(error => console.error(error));
    //   });

      //delete
      card.querySelector('.btn-danger').addEventListener('click', () => {
        card.remove();
        deleteQuote(quote.id);
      })
    });
};

//                  Create new quote
const newQuoteForm = document.querySelector('#new-quote-form');

newQuoteForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const inputQuote = document.querySelector('#new-quote');
    const inputAuthor = document.querySelector('#author');

    const newQuote = {
        quote: inputQuote.value,
        author: inputAuthor.value
    };

    fetch(urlBar, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify(newQuote)
    })
    .then(res => res.json())
    .then(data => listQuote([data])) //because listQuotes was made using a forEach it expects an array, so give it the data as an array of one thing.
    .catch(error => console.error(error));

    inputQuote.value = '';
    inputAuthor.value = '';
});

//                  Like a quote
// function likeQuote(id) {
//     fetch('http://localhost:3000/likes', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             Accept: 'application/json'
//         },
//         body: JSON.stringify({quoteId: quote.id})
//     })
//     .then(res => res.json())
//     .then(newLike => {
//         const likesSpan = card.querySelector('span');
//         likesSpan.textContent = newLike.quoteId
//     })
//     .catch(error => console.error(error))
// }



//                  Eliminate a quote
function deleteQuote(id) {
    fetch(urlBar + `/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => console.log(data))
}


addQuotes()

//Works per specification of lab, but seems kinda janky. Maybe return to it later...