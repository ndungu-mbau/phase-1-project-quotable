const baseUrl = "https://api.quotable.io";
const dbUrl = "http://localhost:3000";

//
const getQuotes = async (limit = 1) => {
  const response = await fetch(`${baseUrl}/quotes/random?limit=${limit}`);
  const data = await response.json();
  return data;
};

const getSingleQuote = async (id) => {
  const response = await fetch(`${baseUrl}/quotes/${id}`);
  const data = await response.json();
  return data;
};

const likeQuote = async (id) => {
  const response = await fetch(`${dbUrl}/quotes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quoteId: id }),
  });
  const data = await response.json();
  return data;
};

const unlikeQuote = async (id) => {
  const response = await fetch(`${dbUrl}/quotes/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
};

const getLikedQuotes = async () => {
  const response = await fetch(`${dbUrl}/quotes`);
  const data = await response.json();
  return data;
};

const renderQuote = async (quote) => {
  const list = document.querySelector("#quote-box .list-group");

  const listElement = document.createElement("li");
  listElement.classList.add("list-group-item");

  const card = document.createElement("div");
  card.classList.add("card");
  card.id = `card-${quote.id}`;

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const quoteBody = document.createElement("blockquote");
  quoteBody.classList.add("blockquote");
  quoteBody.textContent = quote.content;

  const quoteFooter = document.createElement("h5");
  quoteFooter.textContent = `- ${quote.author}`;

  cardBody.appendChild(quoteBody);
  cardBody.appendChild(quoteFooter);

  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");
  cardFooter.classList.add("d-flex");
  cardFooter.classList.add("justify-content-end");

  const likeBtn = document.createElement("button");
  likeBtn.classList.add("btn");
  likeBtn.classList.add("btn-link-primary");

  const icon = document.createElement("i");
  icon.classList.add("ni");
  icon.classList.add("ni-like-2");

  likeBtn.appendChild(icon);

  likeBtn.addEventListener("click", async () => {
    const data = await likeQuote(quote._id);
    if (data.liked) {
      const [nextQuote] = await getQuotes();
      renderQuote(nextQuote);
    } else {
      const [nextQuote] = await getQuotes();
      renderQuote(nextQuote);
    }
  });

  cardFooter.appendChild(likeBtn);
  card.appendChild(cardBody);
  card.appendChild(cardFooter);

  listElement.appendChild(card);
  list.appendChild(listElement);
};

const renderLikedQuote = async ({ id, quote }) => {
  const list = document.querySelector("#liked-quote-box .list-group");

  const listElement = document.createElement("li");
  listElement.classList.add("list-group-item");

  const card = document.createElement("div");
  card.classList.add("card");
  card.id = `card-${quote.id}`;

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const quoteBody = document.createElement("blockquote");
  quoteBody.classList.add("blockquote");
  quoteBody.textContent = quote.content;

  const quoteFooter = document.createElement("h5");
  quoteFooter.textContent = `- ${quote.author}`;

  cardBody.appendChild(quoteBody);
  cardBody.appendChild(quoteFooter);

  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");
  cardFooter.classList.add("d-flex");
  cardFooter.classList.add("justify-content-end");

  const likeBtn = document.createElement("button");
  likeBtn.classList.add("btn");
  likeBtn.classList.add("btn-outline-danger");

  likeBtn.classList.add("btn-danger");

  const icon = document.createElement("i");
  icon.classList.add("ni");
  icon.classList.add("ni-like-2");

  likeBtn.appendChild(icon);

  likeBtn.addEventListener("click", async () => {
    const data = await unlikeQuote(id);
    if (data.id) {
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }

      const quotes = await getLikedQuotes();
      quotes.map(async ({ id, quoteId }) => {
        const quote = await getSingleQuote(quoteId);
        renderLikedQuote({ id, quote });
      });
    } else {
      const [nextQuote] = await getQuotes();
      renderQuote(nextQuote);
    }
  });

  cardFooter.appendChild(likeBtn);
  card.appendChild(cardBody);
  card.appendChild(cardFooter);

  listElement.appendChild(card);
  list.appendChild(listElement);
};

document.addEventListener("DOMContentLoaded", async () => {
  const nextQuoteBtn = document.getElementById("next-quote");
  const likedQuotesBtn = document.getElementById("liked-quotes");
  const quoteBox = document.getElementById("quote-box");
  const likedQuotesBox = document.getElementById("liked-quote-box");
  const listGroup = document.querySelector("#liked-quote-box .list-group");
  const homeBtn = document.getElementById("home");
  const form = document.getElementById("form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const input = document.getElementById("quote-input");
    const val = parseInt(input.value);

    if (val < 1 || val > 50) {
      input.classList.add("is-invalid");
    } else {
      input.classList.remove("is-invalid");
      const list = document.querySelector("#quote-box .list-group");
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }

      const quotes = await getQuotes(val);
      quotes.forEach(renderQuote);
    }
  });

  const [quote] = await getQuotes();
  await renderQuote(quote);

  homeBtn.addEventListener("click", async () => {
    quoteBox.classList.remove("hidden");
    form.classList.remove("hidden");

    likedQuotesBox.classList.add("hidden");

    const list = document.querySelector("#quote-box .list-group");
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    const [quote] = await getQuotes();
    await renderQuote(quote);
  });

  nextQuoteBtn.addEventListener("click", async () => {
    const [quote] = await getQuotes();
    await renderQuote(quote);
  });

  likedQuotesBtn.addEventListener("click", async () => {
    form.classList.add("hidden");
    quoteBox.classList.add("hidden");

    likedQuotesBox.classList.remove("hidden");

    while (listGroup.firstChild) {
      listGroup.removeChild(listGroup.firstChild);
    }

    const quotes = await getLikedQuotes();

    quotes.map(async ({ id, quoteId }) => {
      const quote = await getSingleQuote(quoteId);
      renderLikedQuote({ id, quote });
    });
  });
});
