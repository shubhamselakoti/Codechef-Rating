const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(express.json());
app.use(cors());


app.get('/', function(req, res){
    res.send("Hiiiii");
});

app.get("/:username", async (req, res) => {
  const username = req.params.username;
  const url = `https://www.codechef.com/users/${username}/`;
  let maxRank = null;
  let curRank = null;

  try {
    const response = await axios.get(url);

    if (response.status !== 200) {
      throw new Error('User not found or page not accessible');
    }

    const $ = cheerio.load(response.data);
    const ratingNumber = $('.rating-number').text().trim();
    const ratingHeader = $('.rating-header').text().trim();

    if (ratingNumber && ratingHeader) {
      const smallTag = $('.rating-header small').text().trim();
      const numericValue = smallTag.match(/\d+/);

      curRank = ratingNumber;
      maxRank = numericValue ? numericValue[0] : null;
    }

    res.json({ currentRank: curRank, maxRank: maxRank });
  } catch (error) {
    console.log('Error fetching the page:', error);
    res.status(404).json({ error: 'User not found or page not accessible' });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}
app.listen(port);
