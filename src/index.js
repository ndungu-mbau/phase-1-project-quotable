const baseUrl = "https://api.quotable.io";
const dbUrl = "http://localhost:3000";

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

const getLikedQuotes = async () => {
  const response = await fetch(`${dbUrl}/quotes`);
  const data = await response.json();
  return data;
};
