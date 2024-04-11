const baseUrl = "https://api.quotable.io";
const dbUrl = "http://localhost:3000";

//
const getQuotes = async (params) => {
  const response = await fetch(`${baseUrl}/quotes/random`, params);
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
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

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
  likeBtn.classList.add("btn-outline-primary");
  likeBtn.textContent = "Like Quote";

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

const renderLikedQuote = async (quote) => {
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
  likeBtn.textContent = "Unlike Quote";

  likeBtn.addEventListener("click", async () => {
    const data = await unlikeQuote(quote._id);
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

document.addEventListener("DOMContentLoaded", async () => {
  const nextQuoteBtn = document.getElementById("next-quote");
  const likedQuotesBtn = document.getElementById("liked-quotes");
  const quoteBox = document.getElementById("quote-box");
  const likedQuotesBox = document.getElementById("liked-quote-box");
  const homeBtn = document.getElementById("home");

  const [quote] = await getQuotes();
  await renderQuote(quote);

  homeBtn.addEventListener("click", async () => {
    quoteBox.classList.remove("hidden");
    likedQuotesBox.classList.add("hidden");

    const [quote] = await getQuotes();
    await renderQuote(quote);
  });

  nextQuoteBtn.addEventListener("click", async () => {
    const [quote] = await getQuotes();
    await renderQuote(quote);
  });

  likedQuotesBtn.addEventListener("click", async () => {
    quoteBox.classList.add("hidden");
    likedQuotesBox.classList.remove("hidden");

    const quotes = await getLikedQuotes();
    quotes.map(async ({ quoteId }) => {
      const quote = await getSingleQuote(quoteId);
      renderLikedQuote(quote);
    });
  });
});
