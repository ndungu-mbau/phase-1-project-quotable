const baseUrl = "https://api.quotable.io";
const dbUrl = "http://localhost:3000";

//

/**
 * Fetches random quotes from the Quotable API
 * @param {number} [limit=1] - The number of quotes to fetch. Defaults to 1
 * @returns {Promise<Object>} A promise that resolves to an object containing
 * the quotes. The object has a key "content" which is an array of quote objects
 */
const getQuotes = async (limit = 1) => {
  const response = await fetch(`${baseUrl}/quotes/random?limit=${limit}`);
  const data = await response.json();
  return data;
};

/**
 * Fetches a single quote from the Quotable API
 * @param {string} id - The ID of the quote to fetch
 * @returns {Promise<Object>} A promise that resolves to an object containing
 * the quote. The object has a key "content" which is a quote object
 */
const getSingleQuote = async (id) => {
  const response = await fetch(`${baseUrl}/quotes/${id}`);
  const data = await response.json();
  return data;
};

/**
 * Likes a quote and saves it to the database
 * @param {string} id - The ID of the quote to like
 * @returns {Promise<Object>} A promise that resolves to an object containing
 * information about the liked quote. The object has a key "liked" which is a
 * boolean indicating whether the like was successful.
 */
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

/**
 * Unikes a quote from the database
 * @param {string} id - The ID of the quote to unlike
 * @returns {Promise<Object>} A promise that resolves to an object containing
 * information about the unliked quote. The object has a key "id" which is the
 * ID of the unliked quote.
 */
const unlikeQuote = async (id) => {
  const response = await fetch(`${dbUrl}/quotes/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  return data;
};

/**
 * Fetches all liked quotes from the database
 * @returns {Promise<Object>} A promise that resolves to an array of liked
 * quote objects.
 */
const getLikedQuotes = async () => {
  const response = await fetch(`${dbUrl}/quotes`);
  const data = await response.json();
  return data;
};

// This block renders a quote from the Quotable API to the page.
// It creates elements for the card, the quote body, the quote footer,
// the like button, and the card footer. It attaches event listeners
// to the like button to like the quote and render the next quote from
// the API.
const renderQuote = async (quote) => {
  // Get the element where we will insert the quote
  const list = document.querySelector("#quote-box .list-group");

  // Create a list element to hold the quote card
  const listElement = document.createElement("li");
  listElement.classList.add("list-group-item");

  // Create the card element
  const card = document.createElement("div");
  card.classList.add("card");
  // Give the card a unique ID based on the quote ID
  card.id = `card-${quote.id}`;

  // Create the card body element
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  // Create the quote body element
  const quoteBody = document.createElement("blockquote");
  quoteBody.classList.add("blockquote");
  // Set the quote text as the content of the quote body element
  quoteBody.textContent = quote.content;

  // Create the quote footer element
  const quoteFooter = document.createElement("h5");
  // Set the quote author as the content of the quote footer element
  quoteFooter.textContent = `- ${quote.author}`;

  // Add the quote body and footer to the card body
  cardBody.appendChild(quoteBody);
  cardBody.appendChild(quoteFooter);

  // Create the card footer element
  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");
  // Set the CSS classes for the card footer
  cardFooter.classList.add("d-flex");
  cardFooter.classList.add("justify-content-end");

  // Create the like button element
  const likeBtn = document.createElement("button");
  likeBtn.classList.add("btn");
  likeBtn.classList.add("btn-link-primary");

  // Create the like button icon element
  const icon = document.createElement("i");
  icon.classList.add("ni");
  icon.classList.add("ni-like-2");

  // Add the icon to the like button
  likeBtn.appendChild(icon);

  // Add an event listener to the like button to like the quote
  likeBtn.addEventListener("click", async () => {
    // Try to like the quote
    const data = await likeQuote(quote._id);
    // If the like was successful
    if (data.liked) {
      // Get the next quote from the API
      const [nextQuote] = await getQuotes();
      // Render the next quote
      renderQuote(nextQuote);
    } else {
      // If the like was not successful, get the next quote from the API
      const [nextQuote] = await getQuotes();
      // Render the next quote
      renderQuote(nextQuote);
    }
  });

  // Add the like button to the card footer
  cardFooter.appendChild(likeBtn);

  // Add the card body and footer to the card
  card.appendChild(cardBody);
  card.appendChild(cardFooter);

  // Add the card to the list element
  listElement.appendChild(card);
  // Add the list element to the list where we will insert the quote
  list.appendChild(listElement);
};

/**
+ * Renders a liked quote to the page.
+ * The function gets a liked quote object from the API and renders
+ * a card with the quote text, author, and a "like" button. When the
+ * "like" button is clicked, the function tries to unlike the quote
+ * and if successful, it removes all of the liked quote cards from
+ * the page and gets the liked quotes again from the API and renders
+ * each one. If the unlike was not successful, it gets the next quote
+ * from the API and renders it.
+ */
const renderLikedQuote = async ({ id, quote }) => {
  // Get the list element where we will insert the liked quote
  const list = document.querySelector("#liked-quote-box .list-group");

  // Create a list item element to hold the liked quote card
  const listElement = document.createElement("li");
  // Add the CSS class "list-group-item" to the list item element
  listElement.classList.add("list-group-item");

  // Create the card element to hold the liked quote
  const card = document.createElement("div");
  // Add the CSS class "card" to the card element
  card.classList.add("card");
  // Give the card a unique ID based on the quote ID
  card.id = `card-${quote.id}`;

  // Create the card body element to hold the quote content
  const cardBody = document.createElement("div");
  // Add the CSS class "card-body" to the card body element
  cardBody.classList.add("card-body");

  // Create the quote body element to hold the quote text
  const quoteBody = document.createElement("blockquote");
  // Add the CSS class "blockquote" to the quote body element
  quoteBody.classList.add("blockquote");
  // Set the quote text as the content of the quote body element
  quoteBody.textContent = quote.content;

  // Create the quote footer element to hold the quote author
  const quoteFooter = document.createElement("h5");
  // Set the quote author as the content of the quote footer element
  quoteFooter.textContent = `- ${quote.author}`;

  // Add the quote body and footer to the card body
  cardBody.appendChild(quoteBody);
  cardBody.appendChild(quoteFooter);

  // Create the card footer element to hold the like button
  const cardFooter = document.createElement("div");
  // Add the CSS classes "card-footer" and "d-flex" to the card footer element
  cardFooter.classList.add("card-footer");
  cardFooter.classList.add("d-flex");
  // Add the CSS class "justify-content-end" to the card footer element
  // This CSS class will align the like button to the right of the card
  cardFooter.classList.add("justify-content-end");

  // Create the like button element
  const likeBtn = document.createElement("button");
  // Add the CSS classes "btn" and "btn-outline-danger" to the like button element
  likeBtn.classList.add("btn");
  likeBtn.classList.add("btn-outline-danger");
  // Add the CSS class "btn-danger" to the like button element
  // This CSS class will make the like button red
  likeBtn.classList.add("btn-danger");

  // Create the icon element to hold the "like" icon
  const icon = document.createElement("i");
  // Add the CSS classes "ni" and "ni-like-2" to the icon element
  icon.classList.add("ni");
  icon.classList.add("ni-like-2");

  // Add the icon to the like button
  likeBtn.appendChild(icon);

  // Add an event listener to the like button to unlike the quote
  likeBtn.addEventListener("click", async () => {
    // Try to unlike the quote
    const data = await unlikeQuote(id);
    // If the unlike was successful
    if (data.id) {
      // Remove all of the liked quote cards from the list
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
      // Get all of the liked quotes from the API
      const quotes = await getLikedQuotes();
      // Render each liked quote
      quotes.map(async ({ id, quoteId }) => {
        const quote = await getSingleQuote(quoteId);
        renderLikedQuote({ id, quote });
      });
    } else {
      // If the unlike was not successful, get the next quote from the API
      const [nextQuote] = await getQuotes();
      // Render the next quote
      renderQuote(nextQuote);
    }
  });

  // Add the like button to the card footer
  cardFooter.appendChild(likeBtn);

  // Add the card body and footer to the card
  card.appendChild(cardBody);
  card.appendChild(cardFooter);

  // Add the card to the list element
  listElement.appendChild(card);
  // Add the list element to the list where we will insert the liked quote
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

  /**
   * Handles the form submit event.
   * When the form is submitted, the function gets the value of the input
   * field and validates that it is between 1 and 50. If the value is valid,
   * the function removes all of the quote cards from the page and gets
   * the requested number of quotes from the API and renders each one.
   * If the value is not valid, the function adds a CSS class to the
   * input field to indicate invalid input.
   */
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

  /**
   * Renders the first quote to the page when the document is ready.
   */
  const [quote] = await getQuotes();
  await renderQuote(quote);

  /**
   * Handles the "Home" button click event.
   * When the button is clicked, the function removes the hidden class from
   * the quote box and hides the liked quotes box. It then removes all of the
   * quote cards from the page and gets the first quote from the API and
   * renders it.
   */
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

  /**
   * Handles the "Next Quote" button click event.
   * When the button is clicked, the function gets the next quote from the API
   * and renders it.
   */
  nextQuoteBtn.addEventListener("click", async () => {
    const [quote] = await getQuotes();
    await renderQuote(quote);
  });

  /**
   * Handles the "Liked Quotes" button click event.
   * When the button is clicked, the function hides the form and quote box and
   * shows the liked quotes box. It then removes all of the liked quote cards
   * from the page and gets all of the liked quotes from the API and renders
   * each one.
   */
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
