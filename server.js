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
  let maxRank = 0;
  let curRank = 0;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const ratingNumber = $('.rating-number').text().trim();
    const ratingHeader = $('.rating-header').text().trim();

    if (ratingNumber && ratingHeader) {
      const smallTag = $('.rating-header small').text().trim();
      const numericValue = smallTag.match(/\d+/);

      curRank = ratingNumber;
      maxRank = numericValue ? numericValue[0] : null;
    } else {
      maxRank = null;
      curRank = null;
    }
    if(curRank == null){
        res.json({message: "Maybe user name doesn't exist"})
    }
    res.json({ currentRank: curRank, maxRank: maxRank });
  } catch (error) {
    console.log('Error fetching the page:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
